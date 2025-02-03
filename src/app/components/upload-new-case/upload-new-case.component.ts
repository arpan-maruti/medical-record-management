// todo : pdfValidation

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-upload-new-case',
  imports: [FormsModule, CommonModule],
  templateUrl: './upload-new-case.component.html',
  styleUrls: ['./upload-new-case.component.css'],
})
export class UploadNewCaseComponent implements OnInit {
  clientName: string = '';
  caseReference: string | undefined;
  dateOfBranch: string | undefined;
  loiTypes: any[] = []; // To hold the LOI Types fetched from DataService
  selectedLoi: string = ''; // To store the selected LOI ID
  instructionTypes: any[] = [];
  selectedInstruction: string = ''; // To store the selected Instruction ID
  parameters: any[] = []; // To store the fetched parameters based on selected instruction
  selectedParameters: { [key: string]: boolean } = {};
  isSubmitted: boolean = false;
  clientNameError: string | null = null;
  caseReferenceError: string | null = null;
  dateError: string | null = null;
  parametersError: string | null = null;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loiTypes = this.dataService.getLoiTypes();
    if (this.loiTypes && this.loiTypes.length > 0) {
      this.selectedLoi = this.loiTypes[0]._id;
      this.onLoiChange();
    }
  }

  onInputChange() {
    this.clientNameError = null;
    this.caseReferenceError = null;
    this.dateError = null;
  }

  onLoiChange() {
    // Fetch instructions based on the selected LOI ID
    this.instructionTypes = this.dataService.getInstructionTypesByLoiId(
      this.selectedLoi
    );

    // Reset selected instruction when LOI changes
    this.selectedInstruction =
      this.instructionTypes.length > 0 ? this.instructionTypes[0]._id : '';

    // Fetch parameters when LOI changes (only if an instruction is selected)
    if (this.selectedInstruction) {
      this.onInstructionChange();
    }
  }

  onInstructionChange() {
    console.log(this.selectedInstruction);
    this.parameters = this.dataService.getParametersByInstructionId(
      this.selectedInstruction
    );

    this.parameters.forEach((param) => {
      param.selected = false;
    });

  }

  isSelected(paramId: string): boolean {
    return !!this.selectedParameters[paramId];
  }

  // Toggle the selection of a parameter
  toggleSelection(paramId: string): void {
    this.selectedParameters[paramId] = !this.selectedParameters[paramId];
    if (Object.values(this.selectedParameters).includes(true)) {
      // If at least one parameter is selected, clear the error message
      this.parametersError = null;
    }
  }

  submitForm(): void {
    this.isSubmitted = true;

    // Validate client name
    if (!this.clientName) {
      this.clientNameError = 'Client Name is required.';
    } else if (
      this.clientName.length < 2 ||
      this.clientName.length > 50 ||
      !/^[a-zA-Z]/.test(this.clientName)
    ) {
      this.clientNameError = 'Invalid input. Please enter a valid client name.';
    }

    // Validate case reference(todo: : "This case reference number already exists. Please enter a unique reference number." )
    if (!this.caseReference) {
      this.caseReferenceError = 'Case Reference Number is required.';
    }

    if (this.dateOfBranch == undefined) {
      this.dateError = 'Date is required.';
      console.log('Date:', this.dateOfBranch);
    } else if(!this.dateOfBranch.match(/^\d{4}-\d{2}-\d{2}$/)) {
      this.dateError = 'Invalid date format. Please enter a valid date.';
    }

    // Validate parameters
    if (Object.keys(this.selectedParameters).length === 0 || !Object.values(this.selectedParameters).includes(true)) {
      this.parametersError = 'At least one parameter should be selected.';
    }
    

    if (!this.clientNameError && !this.caseReferenceError && !this.dateError && !this.parametersError) {
      const formData = {
        parent_id: 'case1',
        client_name: this.clientName,
        ref_number: this.caseReference,
        is_deleted: false,
        date_of_breach: this.dateOfBranch, 
        created_by: 'user1', 
        modified_by: 'user2', 
        created_on: new Date().toISOString(), 
        modified_on: new Date().toISOString(), 
        case_uploaded_by: 'John Doe', 
        case_status: 'status4', 
        files: [], 
        parameters: this.selectedParameters, 
      };
      console.log('Form Data:', formData);
    }
  }
}
