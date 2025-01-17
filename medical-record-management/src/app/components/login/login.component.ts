import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  formSubmitted: boolean = false;
  isPasswordVisible: boolean = false; // Track password visibility

  constructor(private router: Router) {}

  // Function to handle login
  onLogin() {
    this.formSubmitted = true; // Mark the form as submitted

    // Perform validation
    this.validateInputs();

    // If there are errors, show an alert
    if (this.emailError || this.passwordError) {
      return;
    }

    // Redirect to OTP page if inputs are valid
    this.router.navigate(['/otp']);
  }

  // Input validation
  validateInputs() {
    if (!this.isValidEmail(this.email)) {
      this.emailError = 'Invalid email format. Please provide a valid email.';
    } else {
      this.emailError = ''; // Clear error if input becomes valid
    }

    if (!this.isValidPassword(this.password)) {
      this.passwordError =
        'Password must be at least 6 characters long and include one special character.';
    } else {
      this.passwordError = ''; // Clear error if input becomes valid
    }
  }

  // Called on input change to dynamically validate
  onInputChange() {
    if (this.formSubmitted) {
      this.validateInputs();
    }
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
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    return passwordRegex.test(password);
  }

  // Toggle password visibility
  toggleVisibility() {
    console.log("hh");
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  
}
