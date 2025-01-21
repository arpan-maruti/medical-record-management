import { Component } from '@angular/core';
import { IConfig, NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, NgxCountriesDropdownModule]
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  selectedCountryCode: string|any = ''; // Default country code (ISO 3166-1 alpha-2 code)
  selectedCountryCallingCode: string = ''; // Default calling code

  formSubmitted = false;
  firstNameError: string | null = null;
  lastNameError: string | null = null;
  emailError: string | null = null;
  phoneNumberError: string | null = null;

  // Country configuration for dropdown
  selectedCountryConfig: IConfig = {
    hideCode: true,
    hideName: true
  };
  countryListConfig: IConfig = {
    hideCode: true,
  };

  // Handle country change
  onCountryChange(country: any) {
    this.selectedCountryCode = country.code; // Country ISO code (e.g., 'US')
    this.selectedCountryCallingCode = country.callingCode; // Country calling code (e.g., '+1')
  }

  // Validate phone number (check for exactly 10 digits)
  validatePhoneNumber() {
    const phoneNumberOnly = this.phoneNumber.replace(/\D/g, ''); // Remove any non-digit characters
    if (phoneNumberOnly.length !== 10) {
      this.phoneNumberError = 'Phone number must be exactly 10 digits';
    } else {
      this.phoneNumberError = null; // Clear error if the phone number is valid
    }
  }

  // Handle input changes
  onInputChange() {
    this.firstNameError = null;
    this.lastNameError = null;
    this.emailError = null;
    this.phoneNumberError = null;
  }

  // Handle form submission
  onRegister() {
    this.formSubmitted = true;
    this.validatePhoneNumber(); // Validate phone number when submitting the form
  
    // Reset error messages
    this.firstNameError = null;
    this.lastNameError = null;
    this.emailError = null;
    this.phoneNumberError = null;
  
    // Validate first name (check if it's empty)
    if (!this.firstName) {
      this.firstNameError = 'First name is required';
    } else if (!this.firstName.match(/^[A-Za-z]+$/)) {
      this.firstNameError = 'Invalid name';
    }
  
    // Validate last name (check if it's empty)
    if (!this.lastName) {
      this.lastNameError = 'Last name is required';
    } else if (!this.lastName.match(/^[A-Za-z]+$/)) {
      this.lastNameError = 'Invalid name';
    }
  
    // Validate email (check if it's empty)
    if (!this.email) {
      this.emailError = 'Email address is required';
    } else if (!this.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      this.emailError = 'Invalid email address';
    }
  
    // Validate phone number (check if it's empty)
    if (!this.phoneNumber) {
      this.phoneNumberError = 'Phone number is required';
    }
  
    // If there are no errors, proceed with registration data
    if (!this.firstNameError && !this.lastNameError && !this.emailError && !this.phoneNumberError) {
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
