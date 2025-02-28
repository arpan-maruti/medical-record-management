import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-upload-files',
  imports: [CommonModule],
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent {
  @Input() caseId: string = ''; // Receive caseId from parent component
  // Added input to select fileType. When used from caselist, pass "document".
  @Input() fileType: string = 'loi';
  @Output() closePopup = new EventEmitter<void>();
  @Output() fileUploaded = new EventEmitter<string>(); // Emit the file name after upload
  file: File | null = null;  // Store the uploaded file
  fileName: string = '';     // Store the file name to display

  constructor(private cookieService: CookieService) {}

  // Extract user id from JWT token (assumes the token carries userId property)
  getUserIdFromJWT(): string {
    const token = this.cookieService.get('jwt');
    console.log('JWT token:', token);
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
        return decoded.userId || decoded.id || ''; 
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return '';
      }
    }
    return '';
  }

  // Function to perform file upload
  uploadFile() {
    const token = this.cookieService.get('jwt');
    const userId = this.getUserIdFromJWT();
    const extension = this?.file?.name.split('.').pop()?.toLowerCase() || 'pdf';
    const formData = new FormData();
    formData.append('file', this.file as File);
    formData.append('fileName', this.file?.name as string);
    formData.append('fileType', this.fileType);
    formData.append('createdBy', userId);
    formData.append('modifiedBy', userId);
    formData.append('fileFormat', extension);


    axios.post(`${environment.apiUrl}/case/${this.caseId}/files`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    })
    .then(response => {
      console.log('File uploaded successfully:', response.data);
      this.fileUploaded.emit(this.file?.name);
    })
    .catch(error => {
      console.error('Error uploading file:', error.message, error.stack);
    });
  }

  // Handle when files are selected via the file input
  onFilesSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.file = selectedFile;
      this.fileName = selectedFile.name;
      // this.uploadFile(selectedFile);
    }
  }

  // Handle when files are dropped into the drag-and-drop area
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.file = file;
      this.fileName = file.name;
      console.log(event.target);
      // this.uploadFile(file);
    }
  }

  // Handle the dragover event (to indicate drop zone)
  onDragOver(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
  }

  // Handle the dragleave event (to remove drop zone indication)
  onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const modal = document.querySelector('.upload-container');
    if (modal && !modal.contains(event.target as Node)) {
      this.closeModal(); // Close the modal if the click is outside
    }
  }
  
  // Close modal
  closeModal() {
    this.closePopup.emit();
  }
}