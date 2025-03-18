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
  @Output() labelSave = new EventEmitter<{ fileId: string, filesLabel: string }>();
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
    this.previewPdf.emit(file);
  }

  onSave(file: any) {
    this.labelSave.emit({ fileId: file.id, filesLabel: file.label });
  }

  onClose() {
    this.closePopup.emit();
  }

  goToFileDetails(file: any) {
    const encodedId = btoa(file.id);
    this.router.navigate(['/case-management/file-details', encodedId]);
  }
}