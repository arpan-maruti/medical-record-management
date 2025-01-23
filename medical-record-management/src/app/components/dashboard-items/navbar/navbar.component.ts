import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isDropdownOpen: boolean = false; // To track dropdown state

  ngOnInit(): void {
    // Optional: Initial setup if needed
  }

  // Method to toggle the dropdown visibility
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close the dropdown if the window is resized (optional for better UI experience)
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isDropdownOpen = false; // Close dropdown on resize (optional)
  }

}
