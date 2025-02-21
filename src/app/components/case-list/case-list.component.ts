import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ViewAndLabelComponent } from '../view-and-label/view-and-label.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { CookieService } from 'ngx-cookie-service';
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
  currentPage: number = 1; // Current page
  totalPages: number = 1; // Total pages
  inputPage: number = 1; // Input page number




  constructor(private cdr: ChangeDetectorRef,
    private dataService: DataService, 
    private sanitizer: DomSanitizer,
    private router: Router,
  private cookieService: CookieService) {
    
  }
  

  
  viewCaseDetails(caseItem: any) {
    this.router.navigate(['/case-management/main-case-view'], {
      state: { caseData: caseItem, viewOnly: true }
    });
  }

 
  
   

  ngAfterViewInit() {
    this.fetchCases();
  }
  
  fetchCases(page: number = 1, caseStatus: string = '') {
    const getCookie = (name: string): string | null => {
      return this.cookieService.get(name) || null;
    }
    const token = getCookie('jwt');
    
    if (!token) {
      // console.error('Token is null. Unable to fetch cases.');
      this.isDataAvailable = false;
      return;
    }
  
    console.log('Retrieved Token:', token);
  
    let apiUrl = `http://localhost:5000/case?page=${page}`;
    if (caseStatus) {
      apiUrl += `&caseStatus=${caseStatus}`;
    }
  
    axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    })
      .then(response => {
        console.log(response.data);
        if (response.data.code === 'Success') {
          this.data = response.data.data; // Assign the fetched data
          this.filteredData = [...this.data]; // Initialize filtered data
          this.isDataAvailable = this.data.length > 0; // Set data availability flag
          this.totalPages = response.data.pagination.total_pages; // Set total pages
        } else {
          console.error('Failed to fetch cases:', response.data.message);
          this.isDataAvailable = false;
        }
      })
      .catch(error => {
        console.error('Error fetching cases:', error);
        this.isDataAvailable = false;
      });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchCases(this.currentPage, this.selectedStatus);
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchCases(this.currentPage, this.selectedStatus);
    }
  }
  openUploadFiles() {
    this.isUploadFilesVisible = true;
  }

  closeUploadFiles() {
    this.isUploadFilesVisible = false;
  }
  onStatusChange() {
    this.fetchCases(this.currentPage, this.selectedStatus);
  }
  
  onSearchChange() {
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
  
    // Fetch subcases only if the case is expanded and subcases are not already fetched
    if (caseItem.expanded && !caseItem.subCases) {
      this.fetchSubCases(caseItem._id).then(subCases => {
        caseItem.subCases = subCases; // Store the fetched subcases in the caseItem object
      });
    }
  }


  fetchSubCases(parentId: string): Promise<any[]> {
    console.log(parentId);
    return new Promise((resolve, reject) => {
      const token = this.cookieService.get('jwt');
      axios.get(`http://localhost:5000/case/${parentId}/subcases/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })
      .then(response => {
        console.log(response.data);
        if (response.data.code === 'Success') {
          
          resolve(response.data.data); // Resolve with the fetched subcases
        } else {
          console.error('Failed to fetch subcases:', response.data.message);
          reject(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching subcases:', error);
        reject(error);
      });
    });
  }


  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.fetchCases(this.currentPage, this.selectedStatus);
    }
  }
  
  goToInputPage() {
    if (this.inputPage >= 1 && this.inputPage <= this.totalPages) {
      this.currentPage = this.inputPage;
      this.fetchCases(this.currentPage, this.selectedStatus);
    } else {
      this.inputPage = this.currentPage; // Reset input to current page if out of range
    }
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

  getSubCases(caseItem: any): any[] {
    
    return caseItem.subCases || []; // Return the stored subcases or an empty array if none
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
  addSubcase(caseItem: any) {
    this.router.navigate(['case-management/main-case/upload-subcase'], {
      state: {
        parentCaseId: caseItem._id,
        clientName: caseItem.client_name,
        parentCaseReference: caseItem.ref_number
      }
    });
  }

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
