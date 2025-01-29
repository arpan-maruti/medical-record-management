import { Component, ChangeDetectorRef } from '@angular/core';
import phoneValidationData from '../../../assets/country-phone-validation.json';  // Import JSON data
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { phone } from 'phone';
import { PhoneMaskService } from '../../phone-mask.service';  // Import the PhoneMaskService
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'; 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports:[FormsModule, CommonModule, NgxMaskDirective],
  providers: [provideNgxMask()]
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
  phoneMask: string = '';  // Variable to store the selected country mask

  constructor(private cdr: ChangeDetectorRef, private phoneMaskService: PhoneMaskService) {}

  ngAfterViewInit() {
    this.countryList = phoneValidationData;  // List of countries from the JSON
    if (this.countryList.length > 0) {
      this.selectedCountryCode = this.countryList[0].countryCode;
      this.selectedCountryName = this.countryList[0].countryName;
      this.updatePhoneMask();
    }
    this.cdr.detectChanges();
  }

  // Update the phone number mask based on selected country
  updatePhoneMask() {
    this.phoneMask = this.phoneMaskService.getMask(this.selectedCountryCode);
  }

  // Handle input changes
  onInputChange() {
    this.firstNameError = null;
    this.lastNameError = null;
    this.emailError = null;
    this.phoneError = null;
    this.updatePhoneMask();  // Update mask on input change
  }

  // Handle form submission
  onRegister() {
    this.formSubmitted = true;

    // Validate first name
    if (!this.firstName) {
      this.firstNameError = 'First name is required';
    } else if (!this.firstName.match(/^[A-Za-z]+$/)) {
      this.firstNameError = 'Invalid name';
    }

    // Validate last name
    if (!this.lastName) {
      this.lastNameError = 'Last name is required';
    } else if (!this.lastName.match(/^[A-Za-z]+$/)) {
      this.lastNameError = 'Invalid name';
    }

    // Validate email
    if (!this.email) {
      this.emailError = 'Email address is required';
    } else if (!this.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      this.emailError = 'Invalid email address';
    }

    // Validate phone number using the `phone` library
    const country = this.countryList.find((c: { countryCode: string; }) => c.countryCode === this.selectedCountryCode);
    if (!this.phoneNumber) {
      this.phoneError = 'Phone number is required';
    } else {
      const phoneValidation = phone(this.phoneNumber, { country: this.selectedCountryCode });

      // Check if the phone number is valid based on the selected country code
      if (!phoneValidation.isValid) {
        this.phoneError = `Invalid phone number for ${country?.countryName}`;
      } else {
        this.phoneError = ''; // Clear the error if valid
      }
    }

    // If there are no errors, proceed with registration data
    if (!this.firstNameError && !this.lastNameError && !this.emailError && !this.phoneError) {
      const registrationData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        selectedCountryCode: this.selectedCountryCode
      };
      console.log('Registration Data:', registrationData);
    }
  }
}
