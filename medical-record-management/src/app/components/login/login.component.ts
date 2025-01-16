import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  // Function to handle login
  onLogin() {
    if (this.email === '' || this.password === '') {
      // Display error alert if email or password is empty
      Swal.fire({
        title: 'Error!',
        text: 'Please enter both email and password.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    } else {
      // Redirect to OTP page if fields are filled
      this.router.navigate(['/otp']);
    }
  }

  // Function for forgot password
  onForgotPassword() {
    Swal.fire({
      title: 'Forgot Password',
      text: 'Please contact BME to reset your password.',
      icon: 'info',
      confirmButtonText: 'Okay'
    });
  }
}
