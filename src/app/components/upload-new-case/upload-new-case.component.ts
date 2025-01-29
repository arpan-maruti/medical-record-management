import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-upload-new-case',
  imports: [FormsModule, CommonModule],
  templateUrl: './upload-new-case.component.html',
  styleUrls: ['./upload-new-case.component.css']
})
export class UploadNewCaseComponent implements OnInit {
  clientName: string | undefined;
  caseReference: string | undefined;
  dateOfBranch: string | undefined;
  loiTypes: any[] = []; // To hold the LOI Types fetched from DataService
  selectedLoi: string = ''; // To store the selected LOI ID
  instructionTypes: any[] = [];
  selectedInstruction: string = ''; // To store the selected Instruction ID
  parameters: any[] = []; // To store the fetched parameters based on selected instruction
  selectedParameters: { [key: string]: boolean } = {};
  constructor(private dataService: DataService) {};

  ngOnInit() {
    // Fetch LOI Types on component initialization
    this.loiTypes = this.dataService.getLoiTypes();
    // Set the first LOI type as the default selected option
    if (this.loiTypes && this.loiTypes.length > 0) {
      this.selectedLoi = this.loiTypes[0]._id;
      this.onLoiChange(); // Trigger onLoiChange to populate instructions
    }
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
  }

  submitForm(): void {
    const formData = {
      parent_id: "case1",  // Parent ID can be set based on your data (static or dynamic)
      client_name: this.clientName,
      ref_number: this.caseReference,
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
