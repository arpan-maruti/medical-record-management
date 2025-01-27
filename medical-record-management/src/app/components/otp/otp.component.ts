import { Component } from '@angular/core';
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
  inputType: string = 'password';
  otpError1: string = '';
  formSubmitted: boolean = false;
  constructor(private router: Router) {}
  
  login(): void {
    this.router.navigate(['/']);
  }

  onInput() {
    this.otpError1 = ' ';
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


  verifyOtp(otpInput: any): void {
    this.otpError1 = ''; // Reset any previous error message

    if (!this.otp.trim()) {
      this.otpError1 = 'OTP field cannot be empty';
    } else if (this.otp !== '123456') {
      this.otpError1 = 'OTP is invalid';
    } else {
      // Logic to validate otp
      console.log('Verifying OTP:', this.otp);
      this.router.navigate(['/case-management']);
    }
  }
}