// todo : pdfValidation

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import axios from 'axios';

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

  ngOnInit(): void {
    this.fetchLoiTypes();
  }

  // Fetch loiTypes from the API
  fetchLoiTypes(): void {
    axios.get('http://localhost:5000/loiType')
      .then(response => {
        // Store loiTypes data (assuming you want to store only loi_msg)
        this.loiTypes = response.data.map((item: any) => ({
          _id: item._id,
          loi_msg: item.loi_msg
        }));

        // Set the first loiType as selected
        if (this.loiTypes && this.loiTypes.length > 0) {
          this.selectedLoi = this.loiTypes[0]._id;
          this.onLoiChange();
        }
      })
      .catch(error => {
        console.error('There was an error fetching loiTypes:', error);
      });
  }

  onInputChange() {
    this.clientNameError = null;
    this.caseReferenceError = null;
    this.dateError = null;
  }

  onLoiChange(): void {
    axios.get(`http://localhost:5000/instruction-types/loi/${this.selectedLoi}`)
      .then(response => {
        this.instructionTypes = response.data;

        // Reset selected instruction when LOI changes
        this.selectedInstruction = this.instructionTypes.length > 0 ? this.instructionTypes[0]._id : '';
        console.log(this.selectedInstruction);
        // Fetch parameters when an instruction is selected
        if (this.selectedInstruction) {
          this.onInstructionChange();  // Call this method if needed
        }
      })
      .catch(error => {
        console.error('Error fetching instructions:', error);
      });
  }

  onInstructionChange(): void {
    console.log('Selected Instruction:', this.selectedInstruction);
  
    // Make API call to fetch parameters based on the selected instruction
    axios.get(`http://localhost:5000/parameters/instruction/${this.selectedInstruction}`)
      .then(response => {
        // Store parameters in the component
        this.parameters = response.data;
  
        // Add 'selected' field to each parameter and set it to false
        this.parameters.forEach(param => {
          param.selected = false;
        });
  
        console.log('Fetched Parameters:', this.parameters);
      })
      .catch(error => {
        console.error('Error fetching parameters:', error);
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
