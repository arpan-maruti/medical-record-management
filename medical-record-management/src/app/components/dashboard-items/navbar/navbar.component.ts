import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    console.log(this.isDropdownOpen);
    event.stopPropagation(); // Prevent the click from propagating to the document
  }

  // Close the dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    if (event.target && !(event.target as Element).closest('.profile-box')) {
      this.isDropdownOpen = false;
    }
  }
}
