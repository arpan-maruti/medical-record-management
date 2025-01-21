import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomAlertComponent } from '../../custom-alert/custom-alert.component';


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule,CustomAlertComponent],
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
      this.passwordError = 'Password must be at least 6 characters long and include one special character.';
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
    console.log("hii");
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    return passwordRegex.test(password);
  }
}