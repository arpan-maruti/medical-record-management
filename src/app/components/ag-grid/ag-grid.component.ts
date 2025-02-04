import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; 
import type { ColDef } from 'ag-grid-community'; 
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { DataService } from '../../services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MasterDetailModule } from 'ag-grid-enterprise'; 
import { LicenseManager } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([ MasterDetailModule ]); 

ModuleRegistry.registerModules([AllCommunityModule]);
LicenseManager.setLicenseKey("YOUR_LICENSE_KEY");
interface IRow {
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
  imports: [AgGridAngular, FormsModule, CommonModule], 
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css'],
})
export class AgGridComponent {
  data: any[] = [];
  rowData: IRow[] = [];
  isBrowser: boolean | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Define main table columns
  colDefs: ColDef<IRow>[] = [
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
        return `<a href="javascript:void(0);" class="view-pdf-link">View PDF</a>`;
      },
    },
    { field: 'Upload_Files', headerName: 'Upload Files' },
    { field: 'Action', headerName: 'Action' },
    { field: 'Add_Subcase', headerName: 'Add Subcase' },
  ];

  // Default column properties
  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
  };

  // Detail cell renderer params for nested table
  detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { field: 'ref_number', headerName: 'Subcase Ref No' },
        { field: 'client_name', headerName: 'Client Name' },
        { field: 'created_on', headerName: 'Date Uploaded' },
        { field: 'status', headerName: 'Status' },
        { field: 'total_files', headerName: 'Total Files' },
        { field: 'total_pages', headerName: 'Total Pages' },
      ],
      defaultColDef: {
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
      },
    },
    getDetailRowData: (params: any) => {
      params.successCallback(params.data.subCases);
    },
  };

  // Fetch and format main cases with subcases
  ngAfterViewInit() {
    this.data = this.dataService.getMainCases();
    this.rowData = this.data.map((mainCase) => ({
      ...mainCase,
      Case_Ref_No: `${mainCase.ref_number}`,
      Instruction_Type: `${this.dataService.getInstructionType(mainCase)}`,
      Client_Name: `${mainCase.client_name}`,
      Total_Files: this.dataService.getTotalFiles(mainCase),
      Total_Pages: this.dataService.getTotalPages(mainCase),
      Date_Uploaded: `${mainCase.created_on}`,
      Uploaded_By: `${this.dataService.getCaseUploader(mainCase)}`,
      Case_Status: `${this.dataService.getCaseStatus(mainCase)}`,
      LOI: 'View PDF',
      Upload_Files: 'Upload Files',
      subCases: this.getSubCaseData(mainCase._id), // Fetch subcases
    }));

    this.cdr.detectChanges();
  }

  // Fetch subcases for a given mainCaseId
  getSubCaseData(mainCaseId: string): ISubCase[] {
    const subCaseData = this.dataService.getSubCases(mainCaseId) || [];
    return subCaseData.map((subCase) => ({
      ref_number: subCase.ref_number,
      client_name: subCase.client_name,
      created_on: subCase.created_on,
      status: "",
      total_files: this.dataService.getTotalFiles(subCase),
      total_pages: this.dataService.getTotalPages(subCase),
    }));
  }
}

  // closePdfPreview() {
  //   this.isPdfPreviewVisible = false;
  // }
  // addPdfPreviewClickListener() {
  //   if (!this.isBrowser) {
  //     return; // Skip execution on the server
  //   }
  //   // Use Renderer2 to add event listener for the "View PDF" link
  //   const links = document.querySelectorAll('.view-pdf-link');
  //   links.forEach((link) => {
  //     this.renderer.listen(link, 'click', (event) => {
  //       const refNumber = event.target.closest('tr')?.dataset['refNumber']; // Get ref_number from the row data
  //       if (refNumber) {
  //         this.openPdfPreview(refNumber);
  //       }
  //     });
  //   });
  // }
  // openPdfPreview(refNumber: string) {
  //   console.log(`Opening PDF for ${refNumber}`);
  //   const unsafeUrl = `/assets/${refNumber}.pdf`; // Use the ref_number to form the filename
  //   this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  //   this.selectedFileName = refNumber;
  //   this.isPdfPreviewVisible = true; // Toggle visibility of the PDF preview
  // }
