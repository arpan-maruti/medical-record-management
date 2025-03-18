import { Component } from '@angular/core';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service'; 
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { environment } from '../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any = {}; 

  constructor(private cookieService: CookieService, private toastr: ToastrService) {}

  ngAfterViewInit() {
    this.getUserProfile();
  }

  // Fetch user profile data
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
            this.toastr.error(response.data.message, 'Error'); // Show error toast
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          this.toastr.error('An error occurred while fetching profile.', 'Error'); // Show error toast
        });

      } catch (error) {
        console.error('Invalid token:', error);
        this.toastr.warning('Invalid token. Please log in again.', 'Warning'); // Show warning toast
      }

    }
  }
}
