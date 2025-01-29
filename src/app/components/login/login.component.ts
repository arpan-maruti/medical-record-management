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
  emailError: string = '';
  passwordError: string = '';
  formSubmitted: boolean = false;
  isPasswordVisible: boolean = false;

  @ViewChild('customAlert') customAlert!: CustomAlertComponent;

  constructor(private router: Router) {}

  onLogin() {
    this.formSubmitted = true;

    // Validate the fields
    this.validateInputs();

    // If there's any error (email or password), don't proceed with login
    if (this.emailError || this.passwordError) {
      return;
    }

    // Proceed to the next page (OTP)
    this.router.navigate(['/otp']);
  }

  validateInputs() {
    // Validate if the email is empty
    if (!this.email) {
      this.emailError = 'Email field can\'t be empty.';
    } else if (!this.isValidEmail(this.email)) {
      this.emailError = 'Invalid email format. Please provide a valid email.';
    } else {
      this.emailError = '';
    }

    // Validate if the password is empty
    if (!this.password) {
      this.passwordError = 'Password field can\'t be empty.';
    } else if (!this.isValidPassword(this.password)) {
      this.passwordError = 'error';
    } else {
      this.passwordError = '';
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

  // Use validator.isEmail() to validate the email format
  isValidEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  // Use validator.js to check password validity
  isValidPassword(password: string): boolean {
    // Check minimum length
    if (!validator.isLength(password, { min: 6 })) {
      return false;
    }
    
    // Check if password contains at least one uppercase letter, one number, and one special character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return true;
  }
}