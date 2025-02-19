import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, CustomAlertComponent],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent {
  otp: string = ''; // Bound to the OTP input field
  email: string = ''; // Email retrieved from query param
  inputType: string = 'password';
  otpError1: string = '';
  formSubmitted: boolean = false;
  resendVisible: boolean = true;
  timer: number = 30; // Countdown timer in seconds
  @ViewChild('customAlert') customAlert!: CustomAlertComponent;
  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    // Get the email from query params
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || ''; // Default to empty string if no email provided
      console.log('Email from query params:', this.email);
    });
  }
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
  async onVerifyClick() {
    try {
      if (!this.otp) {
        alert('Please enter the OTP');
        return;
      }
      // Call the /user/verify-otp API with credentials
      const response = await axios.post(
        'http://localhost:5000/user/verify-otp',
        { email: this.email, otp: this.otp },{withCredentials:true}
      );
      if (response.status === 200) {
        console.log('OTP Verified Successfully:', response.data.message);
        // Redirect to /case-management
        alert('OTP Verified Successfully!');
        this.router.navigate(['/case-management']);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error('OTP Verification Failed:', error.response.data.error);
        alert(`Verification Failed: ${error.response.data.error}`);
      } else {
        console.error('Network Error:', error);
        alert('Network Error! Please try again later.');
      }
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