import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ViewAndLabelComponent } from '../view-and-label/view-and-label.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import axios from 'axios';
@Component({
  selector: 'app-case-list',
  imports: [CommonModule, FormsModule, ViewAndLabelComponent, UploadFilesComponent],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})
export class CaseListComponent {
  filteredData: any[] = [];
  isDataAvailable: boolean = false;
  isPdfPreviewVisible: boolean = false;
  pdfUrl: SafeResourceUrl = '';  
  selectedFileName: string = ''; 
  isViewLabelVisible: boolean = false; 
  isBackgroundBlurred: boolean = false; 
  isUploadFilesVisible: boolean = false;
  selectedFiles: any[] = [];  // Store selected files
  uploadedFileName: string = ''; 
  searchQuery: string = '';  // Search query
  selectedStatus: string  = '';
  data: any[] = [];




  constructor(private cdr: ChangeDetectorRef,
    private dataService: DataService, 
    private sanitizer: DomSanitizer,
    private router: Router) {
    
  }
  

  
  viewCaseDetails(caseItem: any) {
    this.router.navigate(['/case-management/main-case-view'], {
      state: { caseData: caseItem, viewOnly: true }
    });
  }

 
  
   

  ngAfterViewInit() {
    this.fetchCases();
  }
  
  fetchCases() {
    axios.get('http://localhost:5000/case')
      .then(response => {
        console.log(response.data);
        if (response.data.code === 'Success') {
          this.data = response.data.data; // Assign the fetched data
          this.filteredData = [...this.data]; // Initialize filtered data
          console.log(this.filteredData);
          this.isDataAvailable = this.data.length > 0; // Set data availability flag
          // this.applyFilters(); // Apply initial filters
          // this.cdr.detectChanges(); // Trigger change detection
        } else {
          console.error('Failed to fetch cases:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching cases:', error);
      });
  }

  openUploadFiles() {
    this.isUploadFilesVisible = true;
  }

  closeUploadFiles() {
    this.isUploadFilesVisible = false;
  }
  // Filter data by search query
  onSearchChange() {
    this.applyFilters();  // Reapply both search and status filters
  }

  // Filter data by selected status
  onStatusChange() {
    this.applyFilters();  // Reapply both search and status filters
  }

  // Apply both search and status filter together
  applyFilters() {
    this.filteredData = this.data.filter(caseItem => {
      const matchesSearch = this.applySearch(caseItem);
      const matchesStatus = this.applyStatusFilter(caseItem);
      return matchesSearch && matchesStatus;  // Case should match both search and status
    });
  }

  // Filter by search query
  applySearch(caseItem: any): boolean {
    const searchLower = this.searchQuery.toLowerCase();
    return caseItem.client_name.toLowerCase().includes(searchLower) ||
           this.getCaseUploader(caseItem).toLowerCase().includes(searchLower);
  }

  // Filter by selected status
  applyStatusFilter(caseItem: any): boolean {
    // return true;
    const statusLabel = this.dataService.getStatusLabelById(caseItem.case_status);
    return this.selectedStatus ? statusLabel === this.selectedStatus : true; // Only filter if selectedStatus is set
  }

  // Toggle visibility of subcases
  toggleSubCases(caseItem: any) {
    caseItem.expanded = !caseItem.expanded; // Toggle subcase visibility
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



  openPdfPreview(fileName: string) {
    const unsafeUrl = `/assets/q.pdf`;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    this.selectedFileName = fileName;
    this.isPdfPreviewVisible = true;
  }

  closePdfPreview() {
    this.isPdfPreviewVisible = false;
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

  addCase() {
    this.router.navigate(['case-management/upload-new-case']);
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

  sortKey: string = ''; // Key by which to sort
  sortDirection: string = 'asc'; // 'asc' for ascending, 'desc' for descending

  // Sort data based on column and direction
  sortData(key: string): void {
    if (this.sortKey === key) {
      // Toggle sort direction if the same column is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column and default to ascending order
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      console.log(aValue+" "+bValue)
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
