import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

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
  pdfFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit() {
    this.fileId = atob(this.route.snapshot.paramMap.get('id')!);
    this.fetchFileDetails();
  }

  getFileDetails(fileId: string) {
    const token = this.cookieService.get('jwt');
    return axios.get(`${environment.apiUrl}/file/${fileId}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
  }

  updateFile(fileId: string, fileData: any) {
    const token = this.cookieService.get('jwt');
    return axios.patch(`${environment.apiUrl}/file/${fileId}`, fileData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
  }

  fetchFileDetails() {
    this.isLoading = true;
    this.getFileDetails(this.fileId)
      .then((response) => {
        this.fileDetails = response.data.data;
        this.isLoading = false;
      })
      .catch(() => {
        this.toastr.error('Failed to fetch file details', 'Error');
        this.isLoading = false;
      });
  }

  toggleEdit() {
    console.log(this.isEditing);
    this.isEditing = !this.isEditing;
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.pdfFile = target.files[0];
    }
    console.log(this.pdfFile);
  }

  getUserIdFromJWT(): string {
    const token = this.cookieService.get('jwt');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.userId || decoded.id || '';
      } catch {
        return '';
      }
    }
    return '';
  }

  updateFileDetails() {
   
    if (this.pdfFile) {
      alert(this.pdfFile);
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
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        })
        .then(() => {
          this.toastr.success('File updated successfully', 'Success');
          this.isEditing = false;
          this.pdfFile = null;
          window.location.reload();
        })
        .catch(() => {
          this.toastr.error('Error updating file', 'Error');
        });
    } else {
      
      const updatedFileDetails = {
        fileName: this.fileDetails.fileName,
        filesLabel: this.fileDetails.filesLabel,
        fileStatus: this.fileDetails.fileStatus,
        modifiedBy: this.getUserIdFromJWT(),
      };
      
      this.updateFile(this.fileId, updatedFileDetails)
        .then(() => {
          this.toastr.success('File details updated successfully', 'Success');
          this.isEditing = false;
          window.location.reload();
        })
        .catch(() => {
          this.toastr.error('Error updating file details', 'Error');
        });
    }
  }
}
