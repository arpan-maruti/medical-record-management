import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../components/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css'],
  // Remove PrimeNG modules from imports since we're using plain HTML/CSS now
  imports: [
    FormsModule,
    CommonModule,
    SafeUrlPipe
  ]
})
export class FileDetailsComponent implements OnInit {
  fileId!: string;
  fileDetails: any;
  isLoading: boolean = false;
  isEditing: boolean = false;
  userRole: string = 'user';

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router) {}

  ngOnInit() {
    this.fileId = this.route.snapshot.paramMap.get('id')!;
    this.fetchFileDetails();
  }

  getFileDetails(fileId: string) {
    const token = this.cookieService.get('jwt');
    return axios.get(`${environment.apiUrl}/file/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  updateFile(fileId: string, fileData: any) {
    const token = this.cookieService.get('jwt');
    return axios.patch(`${environment.apiUrl}/file/${fileId}`, fileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  fetchFileDetails() {
    this.isLoading = true;
    this.getFileDetails(this.fileId)
      .then(response => {
        this.fileDetails = response.data.data;
        console.log(this.fileDetails);
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error fetching file details:', error);
        this.isLoading = false;
      });
  }
  
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
  
  updateFileDetails() {
    this.updateFile(this.fileId, this.fileDetails)
      .then(response => {
        this.isEditing = false;
      })
      .catch(error => {
        console.error('Error updating file:', error);
      });
  }
}