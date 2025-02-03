import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { DataService } from '../../services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
ModuleRegistry.registerModules([AllCommunityModule]);

import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
interface IRow {
  blank: string;
  Case_Ref_No: string;
  Instruction_Type: string;
  Client_Name: string;
  Total_Files: number;
  Total_Pages: number;
  Date_Uploaded: string;
  Uploaded_By: string;
  Case_Status: string;
  LOI: string;
  Upload_Files: string;
  Action: string;
  Add_Subcase: string;
  subCases: ISubCase[];
}
interface ISubCase {
  ref_number: string;
  client_name: string;
  created_on: string;
  status: string;
  total_files: number;
  total_pages: number;
}
@Component({
  selector: 'app-ag-grid',
  standalone: true,
  imports: [AgGridAngular, FormsModule, CommonModule], // Use AgGridModule
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css'],
})
export class AgGridComponent {
  data: any[] = [];
  filteredData: any[] = [];
  rowData: IRow[] = [];
  pdfUrl: SafeResourceUrl = '';
  selectedFileName: string = '';
  isViewLabelVisible: boolean = false;
  isPdfPreviewVisible: boolean = false;
  isBrowser: boolean | undefined;

  // Mock Data for cases and subcases
  constructor(private cdr: ChangeDetectorRef,
    private dataService: DataService, private sanitizer: DomSanitizer, private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: object)
    {
      this.isBrowser = isPlatformBrowser(this.platformId);
    }
  // Column Definitions
  colDefs: ColDef<IRow>[] = [
    { field: 'blank', headerName: '' },
    { field: 'Case_Ref_No', headerName: 'Case Ref No' },
    { field: 'Instruction_Type', headerName: 'Instruction Type' },
    { field: 'Client_Name', headerName: 'Client Name' },
    { field: 'Total_Files', headerName: 'Total Files' },
    { field: 'Total_Pages', headerName: 'Total Pages' },
    { field: 'Date_Uploaded', headerName: 'Date Uploaded' },
    { field: 'Uploaded_By', headerName: 'Uploaded By' },
    { field: 'Case_Status', headerName: 'Case Status' },
    {
      field: 'LOI',
      headerName: 'LOI',
      cellRenderer: (params: any) => {
        // Render an HTML link
        return `<a href="javascript:void(0);" class="view-pdf-link">View PDF</a>`;
      }
    },
    { field: 'Upload_Files', headerName: '' },
    { field: 'Action', headerName: 'Action' },
    { field: 'Add_Subcase', headerName: 'Add Subcase' },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true, // Enable filtering for all columns
    resizable: true, // Optionally, make columns resizable
  };
  ngAfterViewInit() {
    // Fetching case data
    this.data = this.dataService.getMainCases();
    this.filteredData = [...this.data];
    this.rowData = this.filteredData.map((caseItem) => {
      return {
        ...caseItem,
        Case_Ref_No: `${caseItem.ref_number}`,
        Instruction_Type: `${this.dataService.getInstructionType(caseItem)}`,
        Client_Name: `${caseItem.client_name}`,
        Total_Files: `${this.dataService.getTotalFiles(caseItem)}`,
        Total_Pages: `${this.dataService.getTotalPages(caseItem)}`,
        Date_Uploaded: `${caseItem.created_on}`,
        Uploaded_By: `${this.dataService.getCaseUploader(caseItem)}`,
        Case_Status: `${this.dataService.getCaseStatus(caseItem)}`,
        LOI: 'View PDF', // Text to display in the cell
        Upload_Files: 'Upload Files',
        subCases: caseItem.subcases || [], // Ensure subcases exist
      };
    });
    // Add click event listener to the LOI links
    this.addPdfPreviewClickListener();
    this.cdr.detectChanges();
  }
  closePdfPreview() {
    this.isPdfPreviewVisible = false;
  }
  addPdfPreviewClickListener() {
    if (!this.isBrowser) {
      return; // Skip execution on the server
    }
    // Use Renderer2 to add event listener for the "View PDF" link
    const links = document.querySelectorAll('.view-pdf-link');
    links.forEach((link) => {
      this.renderer.listen(link, 'click', (event) => {
        const refNumber = event.target.closest('tr')?.dataset['refNumber']; // Get ref_number from the row data
        if (refNumber) {
          this.openPdfPreview(refNumber);
        }
      });
    });
  }
  openPdfPreview(refNumber: string) {
    console.log(`Opening PDF for ${refNumber}`);
    const unsafeUrl = `/assets/${refNumber}.pdf`; // Use the ref_number to form the filename
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    this.selectedFileName = refNumber;
    this.isPdfPreviewVisible = true; // Toggle visibility of the PDF preview
  }
}