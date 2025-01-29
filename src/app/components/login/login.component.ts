import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { RouterLink } from '@angular/router';
import validator from 'validator'; // Import validator

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, CustomAlertComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  generalError: string = ''; // Combined error message
  formSubmitted: boolean = false;
  isPasswordVisible: boolean = false;

  @ViewChild('customAlert') customAlert!: CustomAlertComponent;

  constructor(private router: Router) {}

  onLogin() {
    this.formSubmitted = true;

    // Validate the fields
    this.validateInputs();

    // If there's any error, don't proceed with login
    if (this.generalError) {
      return;
    }

    // Proceed to the next page (OTP)
    this.router.navigate(['/otp']);
  }

  validateInputs() {
    // Reset the general error message before validating
    this.generalError = '';

    // Check if email and password are both entered
    if (!this.email || !this.password) {
      this.generalError = 'Please enter both email and password.';
      return; // Exit early if one of them is missing
    }

    // Validate if the email is invalid
    if (!this.isValidEmail(this.email)) {
      this.generalError = 'Invalid email or password.';
      return; // Exit early if email is invalid
    }

    // Validate if the password is invalid
    if (!this.isValidPassword(this.password)) {
      this.generalError = 'Invalid email or password.';
      return; // Exit early if password is invalid
    }
  }

  onInputChange() {
    if (this.formSubmitted) {
      this.validateInputs();
    }
  }

  onForgotPassword() {
    this.customAlert.show(
      'Please contact BME to reset your password.',
      'Forgot Password',
      'OK'
    );
  }

  onCustomAlertConfirm() {
    console.log('Alert confirmed');
  }

  isValidEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  isValidPassword(password: string): boolean {
    if (!validator.isLength(password, { min: 6 })) {
      return false;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasNumber && hasSpecialChar;
  }
}

