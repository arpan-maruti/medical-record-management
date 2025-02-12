import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { RouterLink } from '@angular/router';
import validator from 'validator'; // Import validator
import axios from 'axios';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, CustomAlertComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  generalError: string = '';
  formSubmitted: boolean = false;
  isPasswordVisible: boolean = false;

  @ViewChild('customAlert') customAlert!: CustomAlertComponent;

  constructor(private router: Router) {}

  async onLogin() {
    this.formSubmitted = true;
    this.validateInputs();
    if (this.generalError) {
      return;
    }

    try {
      // 1️⃣ Fetch user details from the backend
      const userResponse = await axios.post('https://your-backend.com/api/auth/login', {
        email: this.email,
        password: this.password,
      });

      if (userResponse.data.success) {
        const phoneNumber = userResponse.data.phone; // Extract phone number

        // 2️⃣ Send OTP to the user's phone
        const otpResponse = await axios.post('https://your-backend.com/api/auth/send-otp', {
          phone: phoneNumber,
        });

        if (otpResponse.data.success) {
          console.log('✅ OTP sent successfully to:', phoneNumber);
          this.router.navigate(['/verify-otp'], {
            queryParams: { email: this.email },
          });
        } else {
          this.generalError = 'Failed to send OTP. Try again later.';
        }
      } else {
        this.generalError = userResponse.data.message || 'Invalid email or password.';
      }
    } catch (error) {
      console.error('❌ Login Error:', error);
      this.generalError = 'Something went wrong. Please try again.';
    }
  }

  validateInputs() {
    this.generalError = '';
    if (!this.email || !this.password) {
      this.generalError = 'Please enter both email and password.';
      return;
    }

    if (!this.isValidEmail(this.email) || !this.isValidPassword(this.password)) {
      this.generalError = 'Invalid email or password.';
      return;
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
    return (
      validator.isLength(password, { min: 6 }) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  }
}

