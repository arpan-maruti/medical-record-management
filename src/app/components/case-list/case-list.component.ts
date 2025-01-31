import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ViewAndLabelComponent } from '../view-and-label/view-and-label.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';

@Component({
  selector: 'app-case-list',
  imports: [CommonModule, FormsModule, ViewAndLabelComponent, UploadFilesComponent],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})
export class CaseListComponent {
  data: any[] = [];
  isDataAvailable: boolean = false;
  isPdfPreviewVisible: boolean = false;
  pdfUrl: SafeResourceUrl = '';  
  selectedFileName: string = ''; 
  isViewLabelVisible: boolean = false; 
  isBackgroundBlurred: boolean = false; 
  isUploadFilesVisible: boolean = false;
  selectedFiles: any[] = [];  // Store selected files
  uploadedFileName: string = '';  // New property to store the uploaded file name

  constructor(private cdr: ChangeDetectorRef,
              private dataService: DataService, 
              private sanitizer: DomSanitizer,
              private router: Router) {}

  ngAfterViewInit() {
    this.data = this.dataService.getMainCases();
    if (this.data.length > 0) {
      this.isDataAvailable = true;
    }
    this.cdr.detectChanges();
  }

  openUploadFiles() {
    this.isUploadFilesVisible = true;
  }

  closeUploadFiles() {
    this.isUploadFilesVisible = false;
  }

  openPdfPreview(fileName: string) {
    const unsafeUrl = `/assets/q.pdf`;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    this.selectedFileName = fileName;
    this.isPdfPreviewVisible = true;
  }

  closePdfPreview() {
    this.isPdfPreviewVisible = false;
  }

  toggleSubCases(caseItem: any) {
    caseItem.expanded = !caseItem.expanded;
  }

  getSubCases(parentId: string) {
    return this.dataService.getSubCases(parentId);
  }

  getInstructionType(caseItem: any) {
    return this.dataService.getInstructionType(caseItem);
  }

  getCaseStatus(caseItem: any) {
    return this.dataService.getCaseStatus(caseItem);
  }

  getTotalFiles(caseItem: any) {
    return this.dataService.getTotalFiles(caseItem);
  }

  getTotalPages(caseItem: any) {
    return this.dataService.getTotalPages(caseItem);
  }

  getCaseUploader(caseItem: any) {
    return this.dataService.getCaseUploader(caseItem);
  }
  
  // This function is called when a file is uploaded and it gets the file name
  onFileUploaded(fileName: string) {
    this.uploadedFileName = fileName;  // Store the file name in the parent component
  }

  addSubcase() {
    this.router.navigate(['case-management/main-case/upload-subcase']);
  };

  openViewLabel() {
    this.selectedFiles = [
      { name: 'File 1.pdf', icon: '📄' },
      { name: 'File 2.pdf', icon: '📄' },
      { name: 'File 3.pdf', icon: '📄' },
      { name: 'File 1.pdf', icon: '📄' },
      { name: 'File 2.pdf', icon: '📄' },
      { name: 'File 3.pdf', icon: '📄' }
    ];

    this.isViewLabelVisible = true;
  }
  
  closeViewLabel() {
    this.isViewLabelVisible = false;
  }
}
