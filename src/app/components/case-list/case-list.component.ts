import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { DataService } from '../../data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-table-view',
  imports: [FormsModule, CommonModule],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})
export class CaseListComponent {
  data: any[] = [];
  isDataAvailable: boolean = false;
  isPdfPreviewVisible: boolean = false;
  pdfUrl: SafeResourceUrl = '';  // This will hold the safe URL for the PDF
  selectedFileName: string = ''; // To display the file name or title in the preview
  searchQuery: string = '';
  selectedStatus: string = ''; // Holds the selected status for filtering
  filteredData: any[] = []; // Stores the filtered cases based on status and search
  private screenWidth: number;


  constructor(private cdr: ChangeDetectorRef, private dataService: DataService, private sanitizer: DomSanitizer) {
    this.screenWidth = window.innerWidth;
  }
  ngOnInit(): void {
    this.updateScreenWidth();
  }

   // Listen to window resize events
   @HostListener('window:resize', ['$event'])
   onResize(event: any) {
     this.screenWidth = event.target.innerWidth;
   }
 
   // Optional: Method to update the screen width dynamically on page load
   updateScreenWidth() {
     this.screenWidth = window.innerWidth;
   }

  isDesktopOrTablet(): boolean {
    return this.screenWidth >= 768;
  }
  ngAfterViewInit() {
    // Fetching case data
    this.data = this.dataService.getMainCases();
    if (this.data.length > 0) {
      this.isDataAvailable = true;
    }
    this.applyFilters(); // Initial filtering based on the status
    this.cdr.detectChanges();
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
    const statusLabel = this.dataService.getStatusLabelById(caseItem.case_status);
    return this.selectedStatus ? statusLabel === this.selectedStatus : true; // Only filter if selectedStatus is set
  }

  // Toggle visibility of subcases
  toggleSubCases(caseItem: any) {
    caseItem.expanded = !caseItem.expanded; // Toggle subcase visibility
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

  // Open PDF preview
  openPdfPreview(fileName: string) {
    const unsafeUrl = `/assets/q.pdf`;  // Your file path here
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);  // Sanitize the URL
    this.selectedFileName = fileName;  // Set the selected file name
    this.isPdfPreviewVisible = true;  // Show the modal
  }
}
