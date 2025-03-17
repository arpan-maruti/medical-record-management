import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { environment } from '../environments/environment';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class SetPasswordComponent {
  passwordForm: FormGroup;
  token: string | null = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.passwordForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        ]
      ],
      confirmPassword: ['', Validators.required],
    });

    // Extract token from URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
    });
  }

  async setPassword() {
    if (this.passwordForm.invalid) {
      this.toastr.warning('Please enter a valid password.', 'Warning');
      return;
    }

    const { password, confirmPassword } = this.passwordForm.value;
    if (password !== confirmPassword) {
      this.toastr.error('Passwords do not match!', 'Error');
      return;
    }

    try {
      await axios.post(`${environment.apiUrl}/user/set-password`, { 
        token: this.token, 
        password 
      });

      this.toastr.success('Password set successfully! Redirecting...', 'Success');
      setTimeout(() => {
        this.router.navigate(['/']); // Redirect to login
      }, 2000);
      
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'Invalid or expired link.';
      this.toastr.error(errorMessage, 'Error');
    }
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
