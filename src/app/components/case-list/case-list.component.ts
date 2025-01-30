import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ViewAndLabelComponent } from '../view-and-label/view-and-label.component';

@Component({
  selector: 'app-case-list',
  imports: [CommonModule, FormsModule, ViewAndLabelComponent],
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
  selectedFiles:any[] = [];  // Store selected files

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

  // openViewLabel(caseItem: any) {
  //   this.isViewLabelVisible = true; 
  //   // Assume each caseItem has a 'files' property with name and icon
  //   this.selectedFiles = caseItem.files.map(file => ({
  //     name: file.name,
  //     icon: file.icon || 'assets/default-icon.png' // Set default icon if not available
  //   }));
  // }

  openViewLabel() {
    this.selectedFiles = [
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
