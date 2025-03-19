import { Component } from '@angular/core';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service'; 
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports:[FormsModule, CommonModule]
})
export class ProfileComponent {
  user: any = {}; 
  isLoading: boolean = true;

  constructor(private cookieService: CookieService, private toastr: ToastrService) {}

  ngAfterViewInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    const token = this.cookieService.get('jwt');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;

        axios.get(`${environment.apiUrl}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code === 'Success') {
            this.user = response.data.data;
          } else {
            console.error('Failed to fetch user data:', response.data.message);
            this.toastr.error(response.data.message, 'Error');
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          this.toastr.error('An error occurred while fetching profile.', 'Error');
        })
        .finally(() => {
          this.isLoading = false; // Stop loading after data is fetched
        });

      } catch (error) {
        console.error('Invalid token:', error);
        this.toastr.warning('Invalid token. Please log in again.', 'Warning');
        this.isLoading = false; // Stop loading if token is invalid
      }
    } else {
      this.isLoading = false; // Stop loading if no token is found
    }
  }
}
