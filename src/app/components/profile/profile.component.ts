import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import {jwtDecode}  from 'jwt-decode';

import { CookieService } from 'ngx-cookie-service'; // Import CookieService

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{
  user: any = {}; // Initialize an empty object to hold user data

  constructor(private cookieService: CookieService) {}

  ngAfterViewInit() {
    this.getUserProfile();
  }

  // Fetch user profile data
  getUserProfile() {
    const token = this.cookieService.get('jwt'); // Get the JWT token from cookies
    
    if (token) {
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
    } else {
      // console.error('No JWT token found');
    }
  }
}
