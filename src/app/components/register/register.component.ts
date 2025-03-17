import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import phoneValidationData from '../../../assets/country-phone-validation.json';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { phone } from 'phone';
import { PhoneMaskService } from '../../services/phone-mask.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'; 
import emailValidator from 'email-validator';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  providers: [provideNgxMask()],
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  selectedCountryCode: string = '';
  selectedCountryName: string = '';
  formSubmitted = false;
  firstNameError: string | null = null;
  lastNameError: string | null = null;
  emailError: string | null = null;
  phoneError: string | null = null;
  countryList: any;
  phoneMask: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private phoneMaskService: PhoneMaskService,
    private cookieService: CookieService,
    private router: Router,  // Inject Router for navigation
    private toastr: ToastrService  // Inject ToastrService for notifications
  ) {}

  ngAfterViewInit() {
    this.countryList = phoneValidationData;
    this.cdr.detectChanges();
  }

  onInputChange() {
    this.firstNameError = null;
    this.lastNameError = null;
    this.emailError = null;
    this.phoneError = null;
  }

  updatePhoneMask() {
    if (this.selectedCountryCode) {
      // Find the country using the calling code
      const country = this.countryList.find(
        (c: { countryCallingCode: string }) => c.countryCallingCode === this.selectedCountryCode
      );
      let isoCode = this.selectedCountryCode; // fallback in case country not found
      if (country) {
        isoCode = country.countryCode;
      }
      this.phoneMask = this.phoneMaskService.getMask(isoCode);
      if (!this.phoneMask) {
        console.warn(`Mask not found for country code: ${isoCode}`);
        this.phoneMask = '000-000-0000';
      }
    }
  }
  
  async fetchValidTlds(): Promise<string[]> {
    return [
      'com', 'org', 'net', 'edu', 'gov', 'int', 'mil', 
      'co', 'io', 'us', 'uk', 'de', 'jp', 'in',
    ];
  }

  async isValidEmail(email: string): Promise<boolean> {
    if (!emailValidator.validate(email)) {
      return false;
    }
    const validTlds = await this.fetchValidTlds();
    const domain = email.split('@')[1];
    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];
    return validTlds.includes(tld);
  }

  getUserIdFromJWT(): string {
     const token = this.cookieService.get('jwt');
     console.log('Token:', token);
     if (token) {
       try {
         const decoded: any = jwtDecode(token);
         return decoded.userId || decoded.id || '';
       } catch (error) {
         console.error('Error decoding JWT:', error);
         return '';
       }
     }
     return '';
   }

  async onRegister() {
    this.formSubmitted = true;
    
    const userId = this.getUserIdFromJWT();
    console.log('User ID:', userId);
    if (!this.firstName) {
      this.firstNameError = 'First name is required';
    } else if (!this.firstName.match(/^[A-Za-z]+$/)) {
      this.firstNameError = 'Invalid name';
    }
  
    if (!this.lastName) {
      this.lastNameError = 'Last name is required';
    } else if (!this.lastName.match(/^[A-Za-z]+$/)) {
      this.lastNameError = 'Invalid name';
    }
  
    if (!this.email) {
      this.emailError = 'Email address is required';
    } else if (!(await this.isValidEmail(this.email))) {
      this.emailError = 'Invalid email address or TLD';
    }
  
    const country = this.countryList.find(
      (c: { countryCallingCode: string }) => c.countryCallingCode === this.selectedCountryCode
    );
    
    if (!this.phoneNumber) {
      this.phoneError = 'Phone number is required';
    } else {
      const isoCode = country ? country.countryCode : this.selectedCountryCode;
      const phoneValidation = phone(this.phoneNumber, { country: isoCode });
      if (!phoneValidation.isValid) {
        this.phoneError = `Invalid phone number for ${country?.countryName}`;
      } else {
        this.phoneError = '';
      }
    }
  
    if (
      !this.firstNameError &&
      !this.lastNameError &&
      !this.emailError &&
      !this.phoneError
    ) {
      const registrationData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        countryCode: this.selectedCountryCode, // This is now the calling code
        phoneNumber: this.phoneNumber,
        createdBy: userId,
        modifiedBy: userId,
      };
      try {
        const getCookie = (name: string): string | null => {
          return this.cookieService.get(name) || null;
        };
        const token = getCookie('jwt');
  
        const response = await axios.post(`${environment.apiUrl}/user/register`, registrationData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });
  
        console.log('Registration successful:', response.data);
        this.toastr.success('User registered successfully!', 'Success');
  
        // Reset form fields after successful registration
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phoneNumber = '';
        this.formSubmitted = false;
  
        // Navigate to home page
        this.router.navigate(['/case-management/user-list']);
      } catch (error:any) {
        console.error('Error during registration:', error);
        this.toastr.error( error.response?.data?.message ||'Failed to register user. Please try again.', 'Error');
      }
    }
  }
}