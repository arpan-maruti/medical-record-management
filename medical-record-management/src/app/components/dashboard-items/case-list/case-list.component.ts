import { Component, ChangeDetectorRef } from '@angular/core';
import dataset from '../../../../assets/data.json';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-case-list',
  imports: [CommonModule],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.css'
})
export class CaseListComponent {
  data: any;
  isDataAvailable: boolean = false;
  loiTypes: any[] = [];
  instructionType: any[] = [];
  selectedLoiType: any[] = [];
  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() {
    this.data;
    if(this.data) {
    console.log(this.data);
    this.isDataAvailable = true;
    }
    this.cdr.detectChanges();
  }

}
