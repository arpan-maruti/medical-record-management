import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, CustomAlertComponent],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent {
  otp: string = ''; // Holds the entered OTP
  inputType: string = 'password';
  otpError1: string = '';
  formSubmitted: boolean = false;
  resendVisible: boolean = false;
  timer: number = 30; // Countdown timer in seconds

  @ViewChild('customAlert') customAlert!: CustomAlertComponent;
  constructor(private router: Router) {}

  login(): void {
    this.router.navigate(['/']);
  }

  onInput(): void {
    this.otpError1 = '';
  }

  toggleVisibility(): void {
    this.inputType = 'text';
    setTimeout(() => {
      this.inputType = 'password';
    }, 1000); // Revert to 'password' after 1 second
  }

  verifyOtp(otpInput: any): void {
    this.otpError1 = '';

    if (!this.otp.trim()) {
      this.otpError1 = 'OTP field cannot be empty';
    } else if (!/^\d{6}$/.test(this.otp)) {
      this.otpError1 = 'OTP must be exactly 6 digits';
    } else if (this.otp !== '123456') { 
      this.otpError1 = 'OTP is invalid';
      this.startResendTimer(); // Start timer after entering an incorrect OTP
    } else {
      console.log('Verifying OTP:', this.otp);
      this.router.navigate(['/case-management']);
    }
  }

  /**
   * Starts a countdown timer for 30 seconds before allowing OTP resend.
   */
  startResendTimer(): void {
    this.resendVisible = false;
    this.timer = 30;
    let interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        clearInterval(interval);
        this.resendVisible = true; // Show resend link after 30 seconds
      }
    }, 1000);
  }

  /**
   * Handles OTP resend logic.
   */
  resendOtp(): void {
    console.log('Resending OTP...');
    this.customAlert.show(
      'Resend OTP Successful',
      'Resend OTP',
      'OK'
    );
    this.startResendTimer(); // Restart the timer

  }

  onCustomAlertConfirm() {
    console.log('Alert confirmed');
  }

}
