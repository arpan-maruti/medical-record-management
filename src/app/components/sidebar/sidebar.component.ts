import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, DoCheck {
  fullUrl: string = '';
  baseUrl: string = '';

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.fullUrl = this.router.url
  }

  ngDoCheck(): void {
    const currentUrl = this.router.url;
    if (this.fullUrl !== currentUrl) {
      this.fullUrl = currentUrl;
    }
    this.baseUrl = this.fullUrl.split('/')[1].replace(/-/g, ' ');
  }

  logout(): void {
    const token = this.cookieService.get('jwt');
    axios.post(`http://localhost:5000/user/logout`, {}, { // empty object as data
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    })
      .then(() => {
        // Optionally clear client-side auth tokens if stored
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}