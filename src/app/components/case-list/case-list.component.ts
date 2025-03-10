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
  isLoading: boolean = false; // Add loader flag
  minLimit: number = 1;
  maxLimit: number = 1;
  totalCases: number = 1;

  constructor(private cdr: ChangeDetectorRef,
    private dataService: DataService, 
    private sanitizer: DomSanitizer,
    private router: Router,
  private cookieService: CookieService) {
    
  }
  

  
  viewCaseDetails(caseItem: any) {
    this.router.navigate(['/case-management/main-case-view', caseItem._id] );
  }

  viewSubCaseDetails(subCase: any) {
    this.router.navigate(['/case-management/sub-case-view', subCase._id] );
  }
  
   

  ngAfterViewInit() {
    this.fetchCases();
  }

  selectedLimit : number = 5;
  limitOptions: { value: number| null; label: number }[] = [
    {value: null,label: 5},
    {value: 10,label: 10}, 
    {value: 20,label: 20},
    {value: 50,label: 50},
    {value: 100,label: 100}
  ];
  onLimitChange() {
    this.fetchCases(this.currentPage, this.selectedStatus, this.searchQuery, this.selectedLimit);
  }
  async fetchCases(page: number = 1, caseStatus: string = '', searchQuery: string = '', limit: number = 5) {
    this.isLoading = true; // Start loading indicator
  
    const token = this.cookieService.get('jwt') || null;
    if (!token) {
      this.isDataAvailable = false;
      this.isLoading = false;
      return;
    }
  
    // Base URL with pagination parameters (default limit = 5)
    let baseUrl = `${environment.apiUrl}/user/cases?page=${page}&limit=${limit}`;
    if (caseStatus) baseUrl += `&case_status=${caseStatus}`;
    if (this.sortKey) {
      const sortParam = this.sortDirection === 'desc' ? `-${this.sortKey}` : this.sortKey;
      baseUrl += `&sort=${sortParam}`;
    }
  
    // Common headers
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
  
    try {
      let response;
      
      if (searchQuery.trim() !== '') {
        const trimmedQuery = encodeURIComponent(searchQuery.trim());
  
        // Fetch paginated search results for both `client_name` & `ref_number`
        const [clientRes, refRes] = await Promise.all([
          axios.get(`${baseUrl}&client_name=${trimmedQuery}`, headers),
          axios.get(`${baseUrl}&ref_number=${trimmedQuery}`, headers)
        ]);
  
        // Combine data and remove duplicates based on `_id`
        const combinedData = [...(clientRes.data.data || []), ...(refRes.data.data || [])];
        const uniqueData = Array.from(new Map(combinedData.map(item => [item._id, item])).values());
  
        // Assign fetched data
        this.data = uniqueData.slice(0, limit); // Ensure only `limit` cases are shown
        this.filteredData = [...this.data];
        this.isDataAvailable = uniqueData.length > 0;
  
        // Set pagination from one of the responses
        this.totalPages = clientRes.data.pagination?.total_pages || 1;
        this.minLimit = (clientRes.data.pagination.current_page - 1) * clientRes.data.pagination.items_per_page + 1;
        this.maxLimit = this.minLimit + this.data.length - 1;
        this.totalCases = clientRes.data.pagination.total_items;
  
      } else {
        // Fetch paginated cases normally
        response = await axios.get(baseUrl, headers);
  
        if (response.data.code === 'Success') {
          this.data = response.data.data.slice(0, limit); // Ensure only `limit` cases are shown
          this.filteredData = [...this.data];
          this.isDataAvailable = this.data.length > 0;
  
          // Extract pagination details
          this.totalPages = response.data.pagination.total_pages;
          this.minLimit = (response.data.pagination.current_page - 1) * response.data.pagination.items_per_page + 1;
          this.maxLimit = this.minLimit + this.data.length - 1;
          this.totalCases = response.data.pagination.total_items;
        } else {
          console.error('Failed to fetch cases:', response.data.message);
          this.isDataAvailable = false;
        }
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      this.isDataAvailable = false;
    } finally {
      this.isLoading = false; // End loading indicator
    }
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
          const fileUrl = `http://localhost:5000/files/${loiFile.file_path}`;
          console.log(loiFile);
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
    this.router.navigate(['case-management/upload-sub-case', caseItem._id ]);
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
    const fileUrl = `http://localhost:5000/files/${file.file_url}`;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
    this.selectedFileName = file.name;
    this.isPdfPreviewVisible = true;
  }

  patchFileLabel(fileId: string, filesLabel: string) {
    const token = this.cookieService.get('jwt');
    axios.patch(`${environment.apiUrl}/file/${fileId}`, 
      { filesLabel: filesLabel },
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
          this.selectedFiles[index].label = filesLabel;
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
