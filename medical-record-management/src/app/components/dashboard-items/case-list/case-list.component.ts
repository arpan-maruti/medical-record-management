import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-case-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css', '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class CaseListComponent {
  data: any[] = [];
  isDataAvailable: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private dataService: DataService) {}

  ngAfterViewInit() {
    // Fetching case data
    this.data = this.dataService.getCases(); // Adjusted to fetch cases
    if (this.data.length > 0) {
      this.isDataAvailable = true;
    }
    this.cdr.detectChanges();
  }

  toggleSubCases(caseItem: any) {
    caseItem.expanded = !caseItem.expanded; // Toggle subcase visibility
  }

  getInstructionType(caseItem: any) {
    const instruction:any = this.dataService.getParameters().find((param:any)=> param._id === caseItem.parameters[0]).instruction_id;
    const msg= this.dataService.getInstructionTypes().find((msg)=> msg._id === instruction).instruction_msg;
    // console.log(msg.instruction_msg);
    return msg;
  }
  
  getCaseStatus(caseItem: any) {
    const status = this.dataService.getCaseStatus().find((status: any) => status._id === caseItem.case_status);
    return status ? status.status : 'Unknown';
  }

  getTotalFiles(caseItem: any) {
    // console.log(caseItem.files.length);
    return caseItem.files ? caseItem.files.length : 0; // Example: count subcases
  }

  getTotalPages(caseItem: any) {
    console.log(caseItem)
    // Example: Sum of pages from files in the case
    return caseItem.files ? caseItem.files.reduce((sum: number, subCase: any) => sum + (subCase.no_of_pages || 0), 0) : 0;
  }
  
}
