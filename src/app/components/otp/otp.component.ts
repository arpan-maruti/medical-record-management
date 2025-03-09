import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, CommonModule, CustomAlertComponent],
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
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || ''; // Default to empty string if not provided
      console.log('Email from query params:', this.email);
      // Start the resend timer on page render
      this.startResendTimer();
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
        this.otpError1 = 'Please enter the OTP';
        this.toastr.error('Please enter the OTP', 'Validation Error');
        return;
      }
      if (!this.otp.match(/[0-9]/g)) {
        this.otpError1 = 'Invalid OTP';
        this.toastr.error('Invalid OTP', 'Validation Error');
        return;
      }
      // Call the /user/verify-otp API with credentials
      const response = await axios.post(
        `${environment.apiUrl}/user/verify-otp`,
        { email: this.email, otp: this.otp },
        { withCredentials: true }
      );
      if (response.status === 200) {
        this.toastr.success(response.data.message || 'OTP Verified Successfully!', 'Success');
        console.log('OTP Verified Successfully:', response.data.message);
        this.router.navigate(['/case-management']);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error('OTP Verification Failed:', error.message);
        this.otpError1 = 'Verification Failed';
        this.toastr.error('Verification Failed', 'Error');
      } else {
        console.error('Network Error:', error);
        this.otpError1 = 'Network Error! Please try again later.';
        this.toastr.error('Network Error! Please try again later.', 'Error');
      }
    }
  }

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

  async resendOtp(): Promise<void> {
    try {
      console.log('Resending OTP...');
      const response = await axios.post(
        `${environment.apiUrl}/user/send-otp`,
        { email: this.email },
        { withCredentials: true }
      );
      if (response.data.success) {
        this.toastr.success('OTP has been resent successfully.', 'Resend OTP');
        this.customAlert.show(
          'OTP has been resent successfully.',
          'Resend OTP',
          'OK'
        );
        // Restart the timer when resend is clicked
        this.startResendTimer();
      } else {
        this.toastr.error(response.data.message || 'Failed to resend OTP. Try again later.', 'Resend OTP');
        this.customAlert.show(
          response.data.message || 'Failed to resend OTP. Try again later.',
          'Resend OTP',
          'OK'
        );
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      this.toastr.error('Error resending OTP. Please try again later.', 'Resend OTP');
      this.customAlert.show(
        'Error resending OTP. Please try again later.',
        'Resend OTP',
        'OK'
      );
    }
  }

  onCustomAlertConfirm() {
    console.log('Alert confirmed');
  }
}