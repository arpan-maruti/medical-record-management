import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import axios from 'axios';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-upload-subcase',
  imports: [FormsModule, CommonModule],
  templateUrl: './upload-subcase.component.html',
  styleUrl: './upload-subcase.component.css',
})
export class UploadSubcaseComponent implements OnInit {
  clientName: string | undefined;
  parentCaseReference: string | undefined;
  parentCaseId: string | undefined;
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
  token: string | null = null;

  constructor(private dataService: DataService, private cookieService: CookieService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { clientName: string, parentCaseReference: string, parentCaseId: string };
    this.clientName = state?.clientName;
    this.parentCaseReference = state?.parentCaseReference;
    this.parentCaseId = state?.parentCaseId; // Add this line
  }

  ngOnInit() {
    this.fetchLoiTypes();
  }

  getCookie(name: string): string | null {
    return this.cookieService.get(name) || null;
  }

  fetchLoiTypes(): void {
    this.token = this.getCookie('jwt');
    console.log('Retrieved Token:', this.token); // Log the retrieved token to debug

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
    this.loiError = null;
    this.instructionError = null;
  }

  onLoiChange(): void {
    if (!this.selectedLoi) {
      this.instructionTypes = []; // Reset instruction types if no LOI is selected
      this.selectedInstruction = ''; // Clear selected instruction
      return;
    }

    axios
      .get(`http://localhost:5000/instruction-types/loi/${this.selectedLoi}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
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
    return !!this.selectedParameters[paramId];
  }

  toggleSelection(paramId: string): void {
    this.selectedParameters[paramId] = !this.selectedParameters[paramId];
    if (Object.values(this.selectedParameters).includes(true)) {
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
  
    if (!this.subCaseReference || this.subCaseReference.trim() === '') {
      this.subCaseReferenceError = 'Subcase Reference is required.';
    }
  
    if (!this.dateOfBranch) {
      this.dateError = 'Date is required.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(this.dateOfBranch)) {
      this.dateError = 'Invalid date format. Please enter a valid date (YYYY-MM-DD).';
    }
  
    if (!this.selectedLoi) {
      this.loiError = 'LOI Type is required.';
    }
  
    if (!this.selectedInstruction) {
      this.instructionError = 'Instruction Type is required.';
    }
  
    if (Object.values(this.selectedParameters).every(value => !value)) {
      this.parametersError = 'At least one parameter must be selected.';
    }
  
    if (this.subCaseReferenceError || this.dateError || this.parametersError || this.loiError || this.instructionError) {
      console.error('Validation errors:', {
        subCaseReferenceError: this.subCaseReferenceError,
        dateError: this.dateError,
        loiError: this.loiError,
        instructionError: this.instructionError,
        parametersError: this.parametersError
      });
      return;
    }
  
    // Decode the JWT token to extract user_id
    const token = this.getCookie('jwt');
    let userId: string | null = null;
  
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        userId = decodedToken?.id || null; // Adjust based on your token structure
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
  
    if (!userId) {
      console.error('Unable to extract user ID from JWT token.');
      return; // Abort submission if user ID cannot be retrieved
    }
  
    const formData = {
      parentId: this.parentCaseId, // Use parentCaseId instead of parentCaseReference
      clientName: this.clientName?.trim() || '',
      refNumber: this.subCaseReference?.trim() || '',
      dateOfBreach: this.dateOfBranch?.trim() || '',
      caseStatus: 'uploaded',
      parameters: Object.keys(this.selectedParameters).filter(param => this.selectedParameters[param]), // Only include selected parameters
      files: [],
      isLoi: !!this.selectedLoi,
      isDeleted: false,
      createdBy: userId, // Set createdBy from the decoded token
      modifiedBy: userId, // Set modifiedBy from the decoded token
    };
  
    console.log('Form Data:', formData);
  
    // Call the API
    axios
      .post('http://localhost:5000/case/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log('Subcase created successfully:', response.data);
        this.router.navigate(['/case-management']);
      })
      .catch((error) => {
        console.error('Error creating subcase:', error.response?.data || error.message);
        // Handle error - e.g., show an error message
      });
  }
}