import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { RouterLink } from '@angular/router';
import validator from 'validator';
import axios from 'axios';
import { environment } from '../environments/environment';
import { ToastrModule, ToastrService } from 'ngx-toastr'; // Import ToastrService
import * as CryptoJS from 'crypto-js';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, CustomAlertComponent, RouterLink, ToastrModule, CommonModule],
  // Removed providers: [MessageService],
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
  constructor(private router: Router, private toastr: ToastrService) {}

  async onLogin() {
    this.formSubmitted = true;
    // Validate inputs
    this.validateInputs();
    if (this.generalError) {
      this.toastr.error(this.generalError, 'Validation Error');
      return;
    }
    try {
      // Step 1: Login the user
      const userResponse = await axios.post(
        `${environment.apiUrl}/user/login`,
        {
          email: this.email,
          password: this.password,
        },
        { withCredentials: true }
      );
      if (!userResponse.data.success) {
        this.generalError = userResponse.data.message || 'Invalid email or password.';
        this.toastr.error(this.generalError, 'Login Failed');
        return;
      }
      // Step 2: Send OTP to the user's phone
      const otpResponse = await axios.post(
        `${environment.apiUrl}/user/send-otp`,
        {
          email: this.email,
        },
        { withCredentials: true }
      );
      if (otpResponse.data.success) {
        this.toastr.success('OTP sent successfully.', 'Success');
    
        // Encrypt email using secret key from environment
        const encryptedEmail = btoa(this.email)
  
    
        // Navigate with encrypted email
        this.router.navigate(['/otp'], { queryParams: { email: encryptedEmail } });
    }else {
        this.generalError =
          otpResponse.data.message || 'Failed to send OTP. Try again later.';
        this.toastr.error(this.generalError, 'OTP Error');
      }
    } catch (error: any) {
      console.error(':x: Login Error:', error);
      this.generalError =
        error.response?.data?.error || 'Something went wrong. Please try again.';
      this.toastr.error(this.generalError, 'Server Error');
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