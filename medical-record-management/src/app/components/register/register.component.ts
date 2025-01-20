import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomAlertComponent } from '../../custom-alert/custom-alert.component';
import { IConfig, NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule,CommonModule,CustomAlertComponent,NgxCountriesDropdownModule]
})
export class RegisterComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  selectedCountryCode: string = '+1'; // Default country code
  countryCodes: any[] = []; // Will hold fetched country codes
  phoneNumberPattern: string = ''; // Dynamic phone number pattern based on country code

  formSubmitted = false;
  firstNameError: string | null = null;
  lastNameError: string | null = null;
  emailError: string | null = null;
  phoneNumberError: string | null = null;

  ngOnInit() {
    
   
  }



 

  onInputChange() {
    // Reset errors on input change
    this.firstNameError = null;
    this.lastNameError = null;
    this.emailError = null;
    this.phoneNumberError = null;
  }

  onRegister() {
    this.formSubmitted = true;
  
    // Validate fields
    if (!this.firstName.match(/^[A-Za-z]+$/)) {
      this.firstNameError = 'First name should contain only letters';
    }
    if (!this.lastName.match(/^[A-Za-z]+$/)) {
      this.lastNameError = 'Last name should contain only letters';
    }
    if (!this.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      this.emailError = 'Invalid email address';
    }
    if (!this.phoneNumber) {
      this.phoneNumberError = 'Phone number is required';
    } else if (!/^[0-9]*$/.test(this.phoneNumber)) {
      this.phoneNumberError = 'Phone number must only contain numbers';
    } else {
      this.phoneNumberError = null; // No error
    }
  
    // If no errors, proceed with registration and log the data
    if (!this.firstNameError && !this.lastNameError && !this.emailError && !this.phoneNumberError) {
      const registrationData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        selectedCountryCode: this.selectedCountryCode
      };
  
      // Log the object to the console
      console.log('Registration Data:', registrationData);
  
  
    }
  }
  

 

  selectedCountryConfig: IConfig = {
    hideCode: true,
    hideName: true
  };
  countryListConfig: IConfig = {
    hideCode: true,
    
  };
  onCountryChange(country: any) {
    this.selectedCountryCode= country.dialling_code;
    // console.log(country);
  }

  onPhoneNumberInput() {
    // Check if the phone number is empty or not a valid number
    if (!this.phoneNumber) {
      this.phoneNumberError = 'Phone number is required';
    } else if (!/^[0-9]*$/.test(this.phoneNumber)) {
      this.phoneNumberError = 'Phone number must only contain numbers';
    } else {
      this.phoneNumberError = null; // No error
    }
  }
}
