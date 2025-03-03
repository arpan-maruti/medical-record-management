import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
// Removed HttpClientModule imports since we now use axios.
import { environment } from '../environments/environment';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import axios from 'axios';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [CommonModule, NgxFileDropModule],
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
})
export class UploadFilesComponent {
  @Input() caseId: string = '';
  @Input() fileType: string = 'loi';
  @Output() closePopup = new EventEmitter<void>();
  @Output() fileUploaded = new EventEmitter<string>();
  file: File | null = null;
  fileName: string = '';

  constructor(private cookieService: CookieService) {}

  getUserIdFromJWT(): string {
    const token = this.cookieService.get('jwt');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.userId || decoded.id || '';
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return '';
      }
    }
    return '';
  }

  uploadFile() {
    if (!this.file) {
      console.error('No file selected');
      return;
    }
  
    const token = this.cookieService.get('jwt');
    const userId = this.getUserIdFromJWT();
    const extension = this.file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('fileName', this.file.name);
    formData.append('fileType', this.fileType);
    formData.append('createdBy', userId);
    formData.append('modifiedBy', userId);
    formData.append('fileFormat', extension);
  
    axios.post(
      `${environment.apiUrl}/case/${this.caseId}/files`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      }
    )
    .then(response => {
      console.log('File uploaded successfully:', response.data);
      this.fileUploaded.emit(this.file?.name);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  }

  triggerFileInput() {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.files + 'hhh');
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileName = this.file.name;
    }
  }

  public dropped(files: NgxFileDropEntry[]) {
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.file = file;
          this.fileName = file.name;
        });
      }
    }
  }

  public fileOver(event: any) {
    console.log('File over event', event);
  }

  public fileLeave(event: any) {
    console.log('File leave event', event);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const modal = document.querySelector('.upload-container');
    if (modal && !modal.contains(event.target as Node)) {
      this.closeModal();
    }
  }

  closeModal() {
    this.closePopup.emit();
  }
}