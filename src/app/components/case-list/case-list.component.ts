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
  filteredData: any[] = [];
  isDataAvailable: boolean = false;
  isPdfPreviewVisible: boolean = false;
  pdfUrl: SafeResourceUrl = '';  
  selectedFileName: string = ''; 
  isViewLabelVisible: boolean = false; 
  isBackgroundBlurred: boolean = false; 
  selectedFiles: any[] = [];  // Store selected files
  searchQuery: string = '';  // Search query

  // Define the type for the sortOrder object
  sortOrder: { 
    [key in 'ref_number' | 'instruction_type' | 'client_name' | 'total_files' | 'total_pages' | 'created_on' | 'uploaded_by' | 'case_status' | 'loi' | 'action' | 'subcase']: 'asc' | 'desc' 
  } = {
    ref_number: 'asc',
    instruction_type: 'asc',
    client_name: 'asc',
    total_files: 'asc',
    total_pages: 'asc',
    created_on: 'asc',
    uploaded_by: 'asc',
    case_status: 'asc',
    loi: 'asc',
    action: 'asc',
    subcase: 'asc',
  };

  constructor(private cdr: ChangeDetectorRef,
              private dataService: DataService, 
              private sanitizer: DomSanitizer,
              private router: Router) {}

  ngAfterViewInit() {
    this.data = this.dataService.getMainCases();
    this.filteredData = [...this.data];  // Initialize filteredData with all cases
    if (this.data.length > 0) {
      this.isDataAvailable = true;
    }
    this.cdr.detectChanges();
  }

  // Filter data based on search query
  onSearch() {
    if (this.searchQuery) {
      this.filteredData = this.data.filter(caseItem =>
        caseItem.ref_number.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        caseItem.client_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        caseItem.case_status.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredData = [...this.data];  // Reset to original data if no search query
    }
  }

  // Sort the data based on column and direction
  sortData(column: 'ref_number' | 'instruction_type' | 'client_name' | 'total_files' | 'total_pages' | 'created_on' | 'uploaded_by' | 'case_status' | 'loi' | 'action' | 'subcase', currentOrder: 'asc' | 'desc') {
    // Toggle sorting order
    console.log('column', column);
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    this.sortOrder[column] = newOrder;

    // Sort filteredData based on the selected column and order
    this.filteredData.sort((a, b) => {
      if (newOrder === 'asc') {
        return a[column] > b[column] ? 1 : (a[column] < b[column] ? -1 : 0);
      } else {
        return a[column] < b[column] ? 1 : (a[column] > b[column] ? -1 : 0);
      }
    });
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
