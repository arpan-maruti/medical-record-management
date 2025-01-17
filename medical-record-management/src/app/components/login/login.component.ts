import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(private router: Router) {}

  // Function to handle login
  onLogin() {
    // Reset error messages
    this.emailError = '';
    this.passwordError = '';

    // Validate email and password
    if (!this.isValidEmail(this.email)) {
      this.emailError = 'Invalid email format. Please provide a valid email.';
    }
    if (!this.isValidPassword(this.password)) {
      this.passwordError =
        'Password must be at least 6 characters long and include one special character.';
    }

    // Display error alert if validation fails
    if (this.emailError || this.passwordError) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please correct the errors highlighted below.',
        icon: 'error',
        confirmButtonText: 'Okay',
        width: '50rem',
        customClass: {
          popup: 'swal-custom-popup',
          confirmButton: 'swal-custom-button',
        },
      });
      return;
    }

    // Redirect to OTP page if inputs are valid
    this.router.navigate(['/otp']);
  }

  // Forgot password function
  onForgotPassword() {
    Swal.fire({
      title: 'Forgot Password',
      text: 'Please contact BME to reset your password.',
      icon: 'info',
      confirmButtonText: 'Okay',
      width: '50rem',
      customClass: {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-button',
      },
    });
  }

  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation
  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    return passwordRegex.test(password);
  }
}
