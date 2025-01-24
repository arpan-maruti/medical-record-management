import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports : [RouterOutlet, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']  // Corrected to styleUrls (plural)
})
export class MainLayoutComponent {
  fullUrl: string = '';
  isProfile: boolean = false;

  constructor(private router: Router) {}

  ngDoCheck(): void {
    // Get the full URL (including path, query params, fragment)
    this.fullUrl = this.router.url;
    console.log(this.fullUrl);  // Logs the full URL

    // Checking if URL contains 'profile'
    if (this.fullUrl.includes('profile')) {
      this.isProfile = true;  // Sets isProfile to true if 'profile' is in the URL
    }
  }
}
