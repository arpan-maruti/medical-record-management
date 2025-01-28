import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-case-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css', '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class CaseListComponent {
  data: any[] = [];
  filteredData: any[] = [];
  isDataAvailable: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private dataService: DataService) {}

  ngAfterViewInit() {
    // Fetching case data
    this.data = this.dataService.getCases();
    console.log("data"+this.data);
    // Filter only cases with parent_id === null
    this.filteredData = this.data.filter((case1) => case1.parent_id == "null");
    console.log("Filtered"+this.filteredData);
    if (this.data.length > 0) {
      this.isDataAvailable = true;
    }

    this.cdr.detectChanges();
  }

  toggleSubCases(caseItem: any) {
    caseItem.expanded = !caseItem.expanded; // Toggle subcase visibility
  }

 

  getSubCases(parentId: string) {
    return this.data.filter((subCase) => subCase.parent_id === parentId); // Fetch subcases for a parent case
  }

  getInstructionType(caseItem: any) {
    const instruction: any = this.dataService.getParameters().find((param: any) => param._id === caseItem.parameters[0]).instruction_id;
    const msg = this.dataService.getInstructionTypes().find((msg) => msg._id === instruction).instruction_msg;
    return msg;
  }

  getCaseStatus(caseItem: any) {
    const status = this.dataService.getCaseStatus().find((status: any) => status._id === caseItem.case_status);
    return status ? status.status : 'Unknown';
  }

  getTotalFiles(caseItem: any) {
    return caseItem.files ? caseItem.files.length : 0; // Count files in the case
  }

  getTotalPages(caseItem: any) {
    // return caseItem.files ? caseItem.files.reduce((sum: number, subCase: any) => sum + (subCase.no_of_pages || 0), 0) : 0;
    return 0;
  }

  getCaseUploader(caseItem: any) {
    return caseItem.case_uploaded_by ? caseItem.case_uploaded_by : 'Unknown';
  }
}
