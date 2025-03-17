import { Component, OnInit, DoCheck, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LogoutDialogueComponent } from '../logout-dialogue/logout-dialogue.component';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, DoCheck {
  fullUrl: string = '';
  baseUrl: string = '';

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fullUrl = this.router.url;
  }

  ngDoCheck(): void {
    const currentUrl = this.router.url;
    if (this.fullUrl !== currentUrl) {
      this.fullUrl = currentUrl;
    }
    this.baseUrl = this.fullUrl.split('/')[1].replace(/-/g, ' ');
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
