import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-upload-subcase',
  imports: [FormsModule, CommonModule],
  templateUrl: './upload-subcase.component.html',
  styleUrl: './upload-subcase.component.css'
})
export class UploadSubcaseComponent {
    clientName: string | undefined;
    parentCaseReference: string | undefined;
    subCaseReference: string | undefined;
    dateOfBranch: string | undefined;
    loiTypes: Array<any> = [];
    selectedLoi: string = '';
    instructionTypes: Array<any> = [];
    selectedInstruction: string = ''; // To store the selected Instruction ID
    parameters: Array<any> = []; // To store the fetched parameters based on selected instruction
    selectedParameters: { [key: string]: boolean } = {};
    subCaseReferenceError: string | null=null;
    dateError: string | null=null;
    parametersError: string | null=null;
    isSubmitted: boolean = false;
    constructor(private dataService: DataService) {};
  
    ngOnInit() {
      this.loiTypes = this.dataService.getLoiTypes();
      if (this.loiTypes && this.loiTypes.length > 0) {
        this.selectedLoi = this.loiTypes[0]._id;
        this.onLoiChange();
      }
    }
  
    onInputChange() {
      this.subCaseReferenceError = null;
      this.dateError = null;
      this.parametersError = null;
    }

    onLoiChange() {
      // Fetch instructions based on the selected LOI ID
      this.instructionTypes = this.dataService.getInstructionTypesByLoiId(this.selectedLoi);
  
      // Reset selected instruction when LOI changes
      this.selectedInstruction = this.instructionTypes.length > 0 ? this.instructionTypes[0]._id : '';
  
      // Fetch parameters when LOI changes (only if an instruction is selected)
      if (this.selectedInstruction) {
        this.onInstructionChange();
      }
    }
  
    onInstructionChange() {
      console.log(this.selectedInstruction);
      this.parameters = this.dataService.getParametersByInstructionId(this.selectedInstruction);
      
      // Initialize the 'selected' property to false for each parameter
      this.parameters.forEach(param => {
        param.selected = false; // or set to true if you want them pre-checked
      });
    
      console.log("Fetched Parameters:", this.parameters);
    }
  
    isSelected(paramId: string): boolean {
      // console.log("Selected Parameters:", this.selectedParameters);
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
      if(!this.subCaseReference) {
        this.subCaseReferenceError = "Subcase Reference is required";
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

      if(!this.subCaseReferenceError && !this.dateError && !this.parametersError) {
        this.isSubmitted = true;
        // Prepare the form data to be submitted
      const formData = {
        parent_id: "case1",  // Parent ID can be set based on your data (static or dynamic)
        client_name: this.clientName,
        subCaseReference_no: this.subCaseReference,
        parentCaseReference_no: this.parentCaseReference,
        is_deleted: false,  // Set this as needed
        date_of_breach: this.dateOfBranch,  // Assuming this date field is from form
        created_by: "user1",  // Set dynamically as needed (e.g., current user)
        modified_by: "user2",  // Set dynamically as needed
        created_on: new Date().toISOString(),  // Current time in ISO format
        modified_on: new Date().toISOString(),  // Current time in ISO format
        case_uploaded_by: "John Doe",  // Can be dynamic if needed
        case_status: "status4",  // Set the status dynamically if required
        files: [],  // Empty array as per your requirement
        parameters: this.selectedParameters,  // Assuming this is already set as array
      };
    
      console.log('Form Data:', formData);
    }
  }
}
