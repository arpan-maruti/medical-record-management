import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  fullUrl: string = '';
  baseUrl: string = '';
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.fullUrl = this.router.url;
  }
  ngDoCheck(): void {
    const current_url = this.router.url;
    if (this.fullUrl !== current_url) {
      this.fullUrl = current_url;
    }
    this.baseUrl = this.fullUrl.split('/')[1].replace(/-/g, ' ');
  }
}
