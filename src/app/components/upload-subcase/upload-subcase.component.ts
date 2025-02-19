import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import axios from 'axios';

import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-upload-subcase',
  imports: [FormsModule, CommonModule],
  templateUrl: './upload-subcase.component.html',
  styleUrl: './upload-subcase.component.css',
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

  subCaseReferenceError: string | null = null;
  dateError: string | null = null;
  parametersError: string | null = null;
  isSubmitted: boolean = false;
  loiError: string | null = null;
  instructionError: string | null = null;
  constructor(private dataService: DataService, private cookieService: CookieService) {}
  token: string|null = null;
  ngOnInit() {
    this.fetchLoiTypes();
  }

  getCookie(name: string): string | null {
    return this.cookieService.get(name) || null;
  }

  
  fetchLoiTypes(): void {

    this.token = this.getCookie('jwt');
    console.log('Retrieved Token:1', this.token); // Log the retrieved token to debug

    if (!this.token) {
      console.error('No JWT token found in cookies');
      return; // Prevent making the API call if the token is not found
    }
    axios.get('http://localhost:5000/loiType', {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
      .then(response => {
        console.log(response.data);
        if (response.data && Array.isArray(response.data.data)) {
          this.loiTypes = response.data.data.map((item: any) => ({
            _id: item._id,
            loi_msg: item.loiMsg,
          }));
          console.log(this.loiTypes);
          if (this.loiTypes.length > 0) {
            this.onLoiChange();
          }
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching loiTypes:', error);
      });
    
  }
  onInputChange() {
    this.subCaseReferenceError = null;
    this.dateError = null;
    this.parametersError = null;
    this.loiError=null;
    this.instructionError=null;
    
  }
  onLoiChange(): void {
    if (!this.selectedLoi) {
      this.instructionTypes = []; // Reset instruction types if no LOI is selected
      this.selectedInstruction = ''; // Clear selected instruction
      return;
    }
   
    axios
      .get(`http://localhost:5000/instruction-types/loi/${this.selectedLoi}`,  {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
        // this.instructionTypes = response.data.data;

        this.instructionTypes = response.data.data.map((item: any) => ({
          _id: item._id,
          instruction_msg: item.instructionMsg,
        }));
        console.log(this.instructionTypes);
      })
      .catch((error) => {
        console.error('Error fetching Instruction Types:', error);
      });
  }
  onInstructionChange(): void {
    if (!this.selectedInstruction) {
      this.parameters = []; // Reset parameters if no instruction is selected
      return;
    }

    axios.get(`http://localhost:5000/parameters/instruction/${this.selectedInstruction}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Ensure cookies are sent with the request
    })
      .then(response => {
        
        this.parameters = response.data.data.map((item: any) => ({
          _id: item._id,
          parameter_msg: item.parameterMsg
        }));

        console.log(this.parameters);
      })
      .catch(error => {
        console.error('Error fetching parameters:', error);
      });
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
    this.subCaseReferenceError = null;
    this.dateError = null;
    this.parametersError = null;
    this.loiError = null;
    this.instructionError = null;

    // Validate subCaseReference
    if (!this.subCaseReference || this.subCaseReference.trim() === '') {
      this.subCaseReferenceError = 'Subcase Reference is required.';
    }

    // Validate dateOfBranch
    if (!this.dateOfBranch) {
      this.dateError = 'Date is required.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(this.dateOfBranch)) {
      this.dateError = 'Invalid date format. Please enter a valid date (YYYY-MM-DD).';
    }

    // Validate LOI selection
    if (!this.selectedLoi) {
      this.loiError = 'LOI Type is required.';
    }

    // Validate Instruction selection
    if (!this.selectedInstruction) {
      this.instructionError = 'Instruction Type is required.';
    }

    // Validate parameters selection
    if (Object.values(this.selectedParameters).every(value => !value)) {
      this.parametersError = 'At least one parameter must be selected.';
    }

    // Check if there are any errors before proceeding
    if (this.subCaseReferenceError || this.dateError || this.parametersError || this.loiError || this.instructionError) {
      console.error('Validation errors:', {
        subCaseReferenceError: this.subCaseReferenceError,
        dateError: this.dateError,
        loiError: this.loiError,
        instructionError: this.instructionError,
        parametersError: this.parametersError
      });
      return; // Stop form submission if there are errors
    }

    // Prepare the form data to be submitted
    const formData = {
      parent_id: 'case1', // Parent ID can be set dynamically
      client_name: this.clientName?.trim() || '',
      subCaseReference_no: this.subCaseReference?.trim() || '',
      parentCaseReference_no: this.parentCaseReference?.trim() || '',
      is_deleted: false,
      date_of_breach: this.dateOfBranch?.trim() || '',
      created_by: 'user1', // Set dynamically as needed (e.g., current user)
      modified_by: 'user2', // Set dynamically as needed
      created_on: new Date().toISOString(),
      modified_on: new Date().toISOString(),
      case_uploaded_by: 'John Doe', // Can be dynamic if needed
      case_status: 'status4', // Set dynamically if required
      files: [], // Empty array as per requirement
      parameters: Object.keys(this.selectedParameters).filter(param => this.selectedParameters[param]), // Only include selected parameters
    };

    console.log('Form Data:', formData);
    // You can now proceed with API submission here
  }


}
