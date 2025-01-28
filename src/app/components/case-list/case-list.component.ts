import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-case-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})
export class CaseListComponent {
  data: any[] = [];
  isDataAvailable: boolean = false;
  constructor(private cdr: ChangeDetectorRef, private dataService: DataService) {}

  
  ngAfterViewInit() {
    // Fetching case data
    this.data = this.dataService.getMainCases();
    console.log("data"+this.data);
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
}