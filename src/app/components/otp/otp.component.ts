import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

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
    private toastr: ToastrService,
    private cookieservice:CookieService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe((params) => {
        this.email = params['email'] || ''; 
        console.log('Email from query params:', this.email);
        this.startResendTimer();
      });
    }
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
      if (!this.otp.match(/^[0-9]+$/)) {
        this.otpError1 = 'Invalid OTP';
        this.toastr.error('Invalid OTP', 'Validation Error');
        return;
      }
  
      // Call OTP verification API
      const response = await axios.post(
        `${environment.apiUrl}/user/verify-otp`,
        { email: this.email, otp: this.otp },
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        console.log(response.data);
        const token = response.data.data.token;
        const decodedToken: any = jwtDecode(token); // Decode the JWT token
        const userId = decodedToken.id;
        if (!token || !userId) {
          console.error('Token or User ID is missing in response');
          this.toastr.error('Authentication failed. No token or user ID received.', 'Error');
          return;
        }
  
        // Decode JWT token
        const userRole = decodedToken?.role;
  
        if (!userRole) {
          console.error('User role not found in token');
          this.toastr.error('User role not found', 'Error');
          return;
        }
  
        console.log('User Role:', userRole);
  
        // Fetch user details using the retrieved userId
        const userResponse = await axios.get(`${environment.apiUrl}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
  
        if (userResponse.status === 200) {
          const user = userResponse.data.data;
          console.log(user);
          const fullName = `${user.first_name} ${user.last_name}`;
  
          // Show a personalized success message
          this.toastr.success(`Welcome, ${fullName}!`, 'Success');
          console.log(`User Verified: ${fullName}`);
        }
  
        // Navigate based on user role
        if (userRole === "admin") {
          this.router.navigate(['/case-management/user-list']);
        } else {
          this.router.navigate(['/case-management']);
        }
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
        this.toastr.error(
          response.data.message || 'Failed to resend OTP. Try again later.',
          'Resend OTP'
        );
        this.customAlert.show(
          response.data.message || 'Failed to resend OTP. Try again later.',
          'Resend OTP',
          'OK'
        );
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      this.toastr.error(
        'Error resending OTP. Please try again later.',
        'Resend OTP'
      );
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
