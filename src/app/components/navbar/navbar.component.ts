import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service'; 
import { jwtDecode } from 'jwt-decode'; 
import { environment } from '../environments/environment';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { LogoutDialogueComponent } from '../logout-dialogue/logout-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-navbar',
  imports: [FormsModule,CommonModule,NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      transition('open <=> closed', animate('0.3s ease'))
    ])
  ]
})
export class NavbarComponent {

  isDropdownOpen = false;
  user: any = {}; // Initialize an empty object to hold user data

  constructor(private toastr: ToastrService,private cookieService: CookieService,  private cdr: ChangeDetectorRef, private router: Router,  private dialog: MatDialog,) {}

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

        axios.get(`${environment.apiUrl}/user/${userId}`, {
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
      // console.error('No JWT token found');
    }
  }
  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  
  toProfile() {
    this.router.navigate(['/case-management/profile']);
  }

  confirmLogout(): void {
    const dialogRef = this.dialog.open(LogoutDialogueComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to logout?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }
    });
  }
  logout(): void {
    const token = this.cookieService.get('jwt');
    axios.post(`${environment.apiUrl}/user/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    })
    .then(() => {
      this.cookieService.delete('jwt');  // Clear JWT from cookies
      this.toastr.success('You have been logged out successfully.', 'Success');
      this.router.navigate(['/']);
    })
    .catch((error) => {
      console.error('Logout error:', error);
      this.toastr.error('Logout failed. Please try again.', 'Error');
    });
  }
}
