import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-otp',
  imports: [FormsModule, CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OtpComponent {
  constructor(private router: Router) {}
  login() {
    this.router.navigate(['/']);
  }
  otp: string = '';
  inputType: string = 'password';
  otpError: boolean = false;
  toggleVisibility(): void {
    this.inputType = 'text';
    console.log(this.otp);
    setTimeout(() => {
      this.inputType = 'password';
    }, 1000); // 2000 milliseconds = 2 seconds
  }
  verifyOtp(otpInput:any): void {
    // Check if the OTP is empty or incorrect
    if (otpInput.invalid) {
      return; // Don't proceed if input is invalid (empty)
    }
    if (this.otp !== '1234') {
      this.otpError = true; // Show error if OTP is incorrect
    } else {
      this.otpError = false;
      alert('OTP Verified!');
    }
  }
}
