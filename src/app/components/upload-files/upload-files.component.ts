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
  uploadFile(file: File) {
    const token = this.cookieService.get('jwt');
    const userId = this.getUserIdFromJWT();
    // Generate a file path. Here, we simply prepend a timestamp.
    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const filePath = `${Date.now()}.pdf`;
    const metadata = {
      fileName: file.name,
      filePath: filePath,
      fileSize: file.size,
      fileType: 'loi',      // As expected by backend
      fileFormat: extension,
      createdBy: userId,
      modifiedBy: userId
    };
    
    console.log(metadata);
    // Use the caseId in the API endpoint (ensure it's set)
    axios.post(`${environment.apiUrl}/case/${this.caseId}/files`, metadata, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    })
    .then(response => {
      console.log('File uploaded successfully:', response.data);
      this.fileUploaded.emit(file.name);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  }

  // Handle when files are selected via the file input
  onFilesSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.file = selectedFile;
      this.fileName = selectedFile.name;
      this.uploadFile(selectedFile);
    }
  }

  // Handle when files are dropped into the drag-and-drop area
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.file = file;
      this.fileName = file.name;
      this.uploadFile(file);
    }
  }

  // Handle the dragover event (to indicate drop zone)
  onDragOver(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  // Handle the dragleave event (to remove drop zone indication)
  onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
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