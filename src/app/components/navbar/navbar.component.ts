import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service'; 
import { jwtDecode } from 'jwt-decode'; 
@Component({
  selector: 'app-navbar',
  imports: [FormsModule,CommonModule,NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isDropdownOpen = false;
  user: any = {}; // Initialize an empty object to hold user data

  constructor(private cookieService: CookieService,  private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.getUserProfile();
  }

  // Fetch user profile data
  getUserProfile() {
    const token = this.cookieService.get('jwt'); // Get the JWT token from cookies

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the JWT token
        const userId = decodedToken.id; // Extract the user_id from the token payload

        axios.get(`http://localhost:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add the JWT token to the Authorization header
          }
        })
        .then(response => {
          if (response.data.code === 'Success') {
            this.user = response.data.data; // Assign the fetched user data to the component
          } else {
            console.error('Failed to fetch user data:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    } else {
      console.error('No JWT token found');
    }
  }
  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  
  toProfile() {
    this.router.navigate(['/case-management/profile']);
  }
  toLogout() {
    this.router.navigate(['/']);
  }
}
