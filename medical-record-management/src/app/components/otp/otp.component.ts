import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp',
  imports: [FormsModule, CommonModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent {
  otp: string = ''; // Holds the entered OTP
  inputType: string = 'password'; // Toggle between 'text' and 'password' for OTP visibility
  otpError: boolean = false; // Tracks if an OTP error occurs
  otpError1: string = '';
  formSubmitted: boolean = false;
  constructor(private router: Router) {}

  /**
   * Navigate back to the login page.
   */
  login(): void {
    this.router.navigate(['/']);
  }

  /**
   * Toggle OTP input visibility between 'password' and 'text'.
   */
  toggleVisibility(): void {
    this.inputType = 'text';
    setTimeout(() => {
      this.inputType = 'password';
    }, 1000); // Revert to 'password' after 1 second
  }

  /**
   * Verify the entered OTP.
   * @param otpInput - The input field reference for validation
   */
  verifyOtp(otpInput: any): void {
    if (otpInput.invalid) {
      this.otpError1 = 'OTP field cannot be empty';
      return; // Exit if the input field is invalid (empty)
    } 
    
    if (this.otp === '123456') {
      // Simulate successful OTP verification
      this.otpError = false;
      alert('OTP Verified Successfully!');
      this.router.navigate(['/dashboard']); // Example: Redirect to the dashboard
    } else {
      // Display an error if the OTP is incorrect
      this.otpError1 = 'OTP is invalid';
      this.otpError = true;
    }
  }

  onVerifyOTP() {
    this.formSubmitted = true;

    if (!this.otp.trim()) {
      this.otpError1 = 'OTP field cannot be empty';
    } else {
      this.otpError1 = '';
      // Proceed with OTP verification logic
      console.log('Verifying OTP:', this.otp);
    }
  }
}