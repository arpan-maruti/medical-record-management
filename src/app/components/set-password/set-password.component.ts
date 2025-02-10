import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css'],
  imports:[ReactiveFormsModule,CommonModule]
})
export class SetPasswordComponent {
  passwordForm: FormGroup;
  token: string | null = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
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
    if (this.passwordForm.invalid) return;

    const { password, confirmPassword } = this.passwordForm.value;
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/user/set-password', { 
        token: this.token, 
        password 
      });

      alert('Password set successfully! Redirecting to login...');
      this.router.navigate(['/']);
      
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'Invalid or expired link.';
      alert(errorMessage);
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
