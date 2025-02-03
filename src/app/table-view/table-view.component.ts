import { ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-table-view',
  imports: [FormsModule, CommonModule],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css'
})
export class TableViewComponent {
  data: any[] = [];
  isDataAvailable: boolean = false;
  isPdfPreviewVisible: boolean = false;
  pdfUrl: SafeResourceUrl = '';  // This will hold the safe URL for the PDF
  selectedFileName: string = ''; // To display the file name or title in the preview
  searchQuery: string = '';

    constructor(private cdr: ChangeDetectorRef, private dataService: DataService,  private sanitizer: DomSanitizer) {}


    get filteredData() {
      return this.data.filter(caseItem => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          caseItem.client_name.toLowerCase().includes(searchLower) ||
          this.getCaseUploader(caseItem).toLowerCase().includes(searchLower)
        );
      });
    }
    ngAfterViewInit() {
      // Fetching case data
      this.data = this.dataService.getMainCases();
      console.log("data", this.data);
      if (this.data.length > 0) {
        this.isDataAvailable = true;
      }
      this.cdr.detectChanges();
    }

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

    openPdfPreview(fileName: string) {
      const unsafeUrl = `/assets/q.pdf`;  // Your file path here
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);  // Sanitize the URL
      this.selectedFileName = fileName;  // Set the selected file name
      this.isPdfPreviewVisible = true;  // Show the modal
    }

}
