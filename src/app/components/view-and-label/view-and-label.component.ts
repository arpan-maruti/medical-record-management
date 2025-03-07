import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode';

@Component({
  standalone: true,
  selector: 'app-view-and-label',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-and-label.component.html',
  styleUrls: ['./view-and-label.component.css']
})
export class ViewAndLabelComponent implements OnInit {
  @Input() selectedFiles: any[] = [];
  @Output() closePopup = new EventEmitter<void>();
  @Output() labelSave = new EventEmitter<{ fileId: string, newLabel: string }>();
  @Output() previewPdf = new EventEmitter<any>();

  isAdmin: boolean = false; // Flag to determine if the user is an admin

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    const token = this.cookieService.get('jwt');
    if (token) {
      try {
        const payload: any = jwtDecode(token);
        console.log(payload);
        this.isAdmin = payload.role == 'admin';
        console.log('Is admin:', this.isAdmin);
      } catch (e) {
        console.error('Error decoding JWT token:', e);
      }
    }
  }

  onPreview(file: any) {
    // Directly emit the file object so the parent can open the PDF preview
    this.previewPdf.emit(file);
  }

  onSave(file: any) {
    this.labelSave.emit({ fileId: file.id, newLabel: file.label });
  }

  onClose() {
    this.closePopup.emit();
  }

  goToFileDetails(file: any) {
    // Navigate to the file-details page with the file id as a route parameter
    this.router.navigate(['/case-management/file-details', file.id]);
  }
}