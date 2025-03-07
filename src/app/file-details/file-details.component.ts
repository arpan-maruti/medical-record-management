import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../components/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css'],
  imports: [FormsModule, CommonModule, SafeUrlPipe],
})
export class FileDetailsComponent implements OnInit {
  fileId!: string;
  fileDetails: any;
  isLoading: boolean = false;
  isEditing: boolean = false;
  userRole: string = 'user';

  // New property to hold the PDF file (if a new one is selected)
  pdfFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fileId = this.route.snapshot.paramMap.get('id')!;
    this.fetchFileDetails();
  }

  getFileDetails(fileId: string) {
    const token = this.cookieService.get('jwt');
    return axios.get(`${environment.apiUrl}/file/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  updateFile(fileId: string, fileData: any) {
    const token = this.cookieService.get('jwt');
    return axios.patch(`${environment.apiUrl}/file/${fileId}`, fileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  fetchFileDetails() {
    this.isLoading = true;
    this.getFileDetails(this.fileId)
      .then((response) => {
        this.fileDetails = response.data.data;
        console.log(this.fileDetails);
        this.isLoading = false;
      })
      .catch((error) => {
        // console.error('Error fetching file details:', error);
        this.isLoading = false;
      });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // Capture the selected PDF file
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.pdfFile = target.files[0];
    }
  }

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
  

   updateFileDetails() {
    // If a new PDF file is selected, use FormData for the update
    if (this.pdfFile) {
      console.log('Updating file with new PDF file:', this.pdfFile);
      const token = this.cookieService.get('jwt');
      const formData = new FormData();
      const extension = this.pdfFile.name.split('.').pop()?.toLowerCase() || 'pdf';
      const userId = this.getUserIdFromJWT();
      formData.append('file', this.pdfFile);
      formData.append('fileName', this.pdfFile.name);
      formData.append('modifiedBy', userId);
      formData.append('fileFormat', extension);
      formData.append('fileSize', this.pdfFile.size.toString());
      axios
        .patch(`${environment.apiUrl}/file/${this.fileId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
          this.isEditing = false;
          this.pdfFile = null;
          window.location.reload(); // Refresh the page on success
        })
        .catch((error) => {
          console.error('Error updating file:', error);
        });
    } else {
      const updatedFileDetails = {
        fileName: this.fileDetails.fileName,
        filesLabel: this.fileDetails.filesLabel,
        fileStatus: this.fileDetails.fileStatus,
        modifiedBy: this.getUserIdFromJWT(),
      };
      console.log(updatedFileDetails);
      this.updateFile(this.fileId, updatedFileDetails)
        .then((response) => {
          console.log(response.data);
          this.isEditing = false;
          window.location.reload(); // Refresh the page on success
        })
        .catch((error) => {
          console.error('Error updating file:', error);
        });
    }
  } 
}
