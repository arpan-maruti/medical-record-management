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
import { environment } from '../environments/environment';
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
  selectedCaseId: string = '';
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';



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

  viewSubCaseDetails(subCase: any) {
    this.router.navigate(['/case-management/sub-case-view'], {
      state: { caseData: subCase, viewOnly: true }
    });
  }
  
   

  ngAfterViewInit() {
    this.fetchCases();
  }
  fetchCases(page: number = 1, caseStatus: string = '', searchQuery: string = '') {
    console.log(caseStatus);
    const getCookie = (name: string): string | null => {
      return this.cookieService.get(name) || null;
    }
    const token = getCookie('jwt');
    
    if (!token) {
      this.isDataAvailable = false;
      return;
    }
  
    console.log('Retrieved Token:', token);
  
    let apiUrl = `${environment.apiUrl}/user/cases?page=${page}`;
    if (caseStatus) {
      apiUrl += `&case_status=${caseStatus}`;
    }
    
    // Append sort parameter for server-side sorting
    if (this.sortKey) {
      const sortParam = this.sortDirection === 'desc' ? `-${this.sortKey}` : this.sortKey;
      apiUrl += `&sort=${sortParam}`;
    }
    
    // Append search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      apiUrl += `&client_name=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    console.log(apiUrl);
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
        this.data = response.data.data;
        this.filteredData = [...this.data];
        this.isDataAvailable = this.data.length > 0;
        this.totalPages = response.data.pagination.total_pages;
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

  sortBy(column: string): void {
    if (this.sortKey === column) {
      // Toggle sort direction if same column is clicked.
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new sort column and default ascending.
      this.sortKey = column;
      this.sortDirection = 'asc';
    }
    // Refresh the cases list with the latest sort criteria.
    this.fetchCases(this.currentPage, this.selectedStatus, this.searchQuery);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchCases(this.currentPage, this.selectedStatus, this.searchQuery);
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchCases(this.currentPage, this.selectedStatus, this.searchQuery);
    }
  }
  openUploadFiles(caseId: string) {
    this.isUploadFilesVisible = true;
    this.selectedCaseId = caseId;
  }

  closeUploadFiles() {
    this.isUploadFilesVisible = false;
  }
  onStatusChange() {
    this.fetchCases(this.currentPage, this.selectedStatus, this.searchQuery);
  }
  
  onSearchChange() {
    this.fetchCases(this.currentPage, this.selectedStatus, this.searchQuery);
  }
  // // Apply both search and status filter together
  // applyFilters() {
  //   this.filteredData = this.data.filter(caseItem => {
  //     const matchesSearch = this.applySearch(caseItem);
  //     const matchesStatus = this.applyStatusFilter(caseItem);
  //     return matchesSearch && matchesStatus;  // Case should match both search and status
  //   });
  // }

  // Filter by search query
  // applySearch(caseItem: any): boolean {
  //   const searchLower = this.searchQuery.toLowerCase();
  //   return caseItem.client_name.toLowerCase().includes(searchLower) ||
  //          this.getCaseUploader(caseItem).toLowerCase().includes(searchLower);
  // }

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
      axios.get(`${environment.apiUrl}/case/${parentId}/subcases/`, {
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



  openPdfPreview(caseId: string) {
    console.log(caseId);
    const token = this.cookieService.get('jwt');
    axios.get(`${environment.apiUrl}/case/${caseId}/file`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then(response => {
      console.log(response.data);
      if (response.data.code === 'Success') {
        const files = response.data.data;

        // Pick the file with fileType "loi" for the LOI preview
        const loiFiles = files.filter((file: any) => file.file_type === 'loi');
        if (loiFiles.length > 0) {
          const loiFile = loiFiles[0];
          // Use the static file server URL with the filename from the file data
          const fileUrl = `http://localhost:5000${loiFile.file_path}`;
          console.log(fileUrl);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
          this.selectedFileName = loiFile.file_name;
          this.isPdfPreviewVisible = true;
        }
      } else {
        console.error('Failed to fetch files:', response.data.message);
      }
    })
    .catch(error => {
      console.error('Error fetching files:', error);
    });
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

  openViewLabel(caseId: string) {
    const token = this.cookieService.get('jwt');
    axios.get(`${environment.apiUrl}/case/${caseId}/file`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then(response => {
      if (response.data.code === 'Success') {
        const files = response.data.data;
        debugger;
        // Only show files with file_type "document" in the View/Label popup
        const documentFiles = files.filter((file: any) => file.file_type === 'document');
        this.selectedFiles = documentFiles.map((file: any) => ({
          id: file._id,
          name: file.file_name,
          label: file.files_label || '',
          icon: '📄',
          file_url: file.file_path, // include URL for preview
          caseId  // attach the current caseId to each file
        }));
  
        this.isViewLabelVisible = true;
      } else {
        console.error('Failed to fetch files:', response.data.message);
      }
    })
    .catch(error => {
      console.error('Error fetching files:', error);
    });
  }

  openDocumentPreview(file: any) {
    // Build URL using the file name with a current timestamp appended as a query parameter
    console.log(file);
    const fileUrl = `http://localhost:5000/files/${file.file_url}`;
    debugger;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
    this.selectedFileName = file.name;
    this.isPdfPreviewVisible = true;
  }

  patchFileLabel(fileId: string, newLabel: string) {
    const token = this.cookieService.get('jwt');
    axios.patch(`${environment.apiUrl}/file/${fileId}`, 
      { files_label: newLabel },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    )
    .then(response => {
      if (response.data.code === 'Success') {
        console.log('File label updated successfully.');
        // Optionally update the local file data
        const index = this.selectedFiles.findIndex(file => file.id === fileId);
        if (index !== -1) {
          this.selectedFiles[index].label = newLabel;
        }
      } else {
        console.error('Failed to update file label:', response.data.message);
      }
    })
    .catch(error => {
      console.error('Error updating file label:', error);
    });
  }
  
  closeViewLabel() {
    this.isViewLabelVisible = false;
  }

 
}
