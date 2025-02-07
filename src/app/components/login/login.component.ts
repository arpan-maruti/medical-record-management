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
  generalError: string = '';
  formSubmitted: boolean = false;
  isPasswordVisible: boolean = false;

  @ViewChild('customAlert') customAlert!: CustomAlertComponent;

  constructor(private router: Router) {}

  onLogin() {
    this.formSubmitted = true;
    this.validateInputs();
    if (this.generalError) {
      return;
    }
    this.router.navigate(['/otp']);
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

