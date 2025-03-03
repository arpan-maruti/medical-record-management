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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  providers: [provideNgxMask()],
})
export class RegisterComponent {
  // ...existing code...
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
    private router: Router  // Inject Router for navigation
  ) {}

  ngAfterViewInit() {
    this.countryList = phoneValidationData;
    console.log('Country List loaded:', this.countryList);
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
      this.phoneMask = this.phoneMaskService.getMask(this.selectedCountryCode);
      if (!this.phoneMask) {
        console.warn(`Mask not found for country code: ${this.selectedCountryCode}`);
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

  async onRegister() {
    this.formSubmitted = true;
  
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
  
    const country = this.countryList.find((c: { countryCode: string }) => c.countryCode === this.selectedCountryCode);
    if (!this.phoneNumber) {
      this.phoneError = 'Phone number is required';
    } else {
      const phoneValidation = phone(this.phoneNumber, { country: this.selectedCountryCode });
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
        countryCode: this.selectedCountryCode,
        phoneNumber: this.phoneNumber,
      };
  
      try {
        const getCookie = (name: string): string | null => {
          return this.cookieService.get(name) || null;
        };
        const token = getCookie('jwt');
        console.log('Retrieved Token:1', token);
  
        const response = await axios.post(`${environment.apiUrl}/user/register`, registrationData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });
  
        console.log('Registration successful:', response.data);
        alert('User registered successfully!');
  
        // Reset form fields after successful registration
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phoneNumber = '';
        this.formSubmitted = false;

        // Navigate to home page
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Failed to register user. Please try again.');
      }
    }
  }
}