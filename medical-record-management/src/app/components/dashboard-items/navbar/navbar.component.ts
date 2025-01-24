import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../data.service';
@Component({
  selector: 'app-navbar',
  imports: [FormsModule,CommonModule,NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isDropdownOpen = false;
  // Toggle the dropdown visibility
  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close the dropdown if the window is resized (optional for better UI experience)
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isDropdownOpen = false; // Close dropdown on resize (optional)
  }
  user: any;
  constructor(private dataService: DataService, private cdr: ChangeDetectorRef, private router: Router) {}
  ngAfterViewInit() : void {
    this.user=this.dataService.getUsers()[0];
    this.cdr.detectChanges();
  }
  toProfile() {
    this.router.navigate(['/dashboard/profile']);
  }
  toLogout() {
    this.router.navigate(['/']);
  }
}
