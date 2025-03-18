import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private cookieService: CookieService, private toastr: ToastrService) {}

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
      this.toastr.warning('Please select a file before uploading.', 'No File Selected');
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
    formData.append('fileSize', this.file.size.toString());
    console.log(this.file.size.toString());

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
      this.toastr.success('File uploaded successfully!', 'Success');
      console.log('File uploaded successfully:', response.data);
      this.fileUploaded.emit(this.file?.name);
      this.file = null;
      this.fileName = '';
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      this.toastr.error('Failed to upload file. Please try again.', 'Upload Error');
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileName = this.file.name;
      this.toastr.info(`Selected file: ${this.fileName}`, 'File Selected');
    }
  }

  dropped(files: NgxFileDropEntry[]) {
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.file = file;
          this.fileName = file.name;
          this.toastr.info(`Dropped file: ${this.fileName}`, 'File Selected');
        });
      }
    }
  }

  fileOver(event: any) {
  
  }

  fileLeave(event: any) {
  
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const modal = document.querySelector('.upload-container');
    if (modal && !modal.contains(event.target as Node)) {
      // this.closeModal();
    }
  }

  closeModal() {
   
    this.closePopup.emit();
  }
}
