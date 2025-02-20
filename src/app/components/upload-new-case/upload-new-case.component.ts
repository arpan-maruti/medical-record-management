import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

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
  loiTypes: any[] = []; // Holds the LOI Types
  selectedLoi: string = ''; // Initially empty
  instructionTypes: any[] = []; // Holds Instruction Types
  selectedInstruction: string = ''; // Initially empty
  parameters: any[] = []; // Holds Parameters
  selectedParameters: string[] = []; // Holds only IDs of selected parameters

  // Validation errors
  isSubmitted: boolean = false;
  clientNameError: string | null = null;
  caseReferenceError: string | null = null;
  dateError: string | null = null;
  loiError: string | null = null;
  instructionError: string | null = null;
  parametersError: string | null = null;

  caseData: any;
  viewOnly: boolean = false;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.caseData = navigation.extras.state['caseData'];
      this.viewOnly = navigation.extras.state['viewOnly'];
    }
  }

  ngOnInit() {
    if (this.caseData) {
      console.log(this.caseData);
      // Populate basic case details
      this.clientName = this.caseData.clientName;
      this.caseReference = this.caseData.refNumber;
      this.dateOfBranch = this.caseData.dateOfBreach; // Adjust based on your data structure
  
      // Populate LOI Type
      this.selectedLoi = this.caseData.loiType; // Assuming loiType is the ID of the selected LOI
      console.log("loi:" + this.selectedLoi);
  
      // Populate Instruction Type
      this.selectedInstruction = this.caseData.instructionMsg; // Assuming instructionType is the ID of the selected instruction
      console.log("instr:" + this.selectedInstruction);
  
      // Populate Parameters
      this.selectedParameters = this.caseData.parameters || []; // Assuming parameters is an array of selected parameter IDs
      console.log(this.selectedParameters);
    }
  
    // Fetch LOI Types and Instruction Types
    this.fetchLoiTypes().then(() => {
      if (this.selectedLoi) {
        this.onLoiChange();
      }
    });
  }

  ngAfterViewInit(): void {
    this.fetchLoiTypes();
  }

  getCookie(name: string): string | null {
    return this.cookieService.get(name) || null;
  }

  // Fetch loiTypes from the API
  async fetchLoiTypes(): Promise<void> {
    const token = this.getCookie('jwt');
    console.log('Retrieved Token:1', token); // Log the retrieved token to debug

    if (!token) {
      console.error('No JWT token found in cookies');
      return; // Prevent making the API call if the token is not found
    }

    try {
      const response = await axios.get('http://localhost:5000/loiType', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });
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
    } catch (error) {
      console.error('There was an error fetching loiTypes:', error);
    }
  }

  onInputChange() {
    this.clientNameError = null;
    this.caseReferenceError = null;
    this.dateError = null;
    this.loiError = null;
    this.instructionError = null;
    this.parametersError = null;
  }

  onLoiChange(): void {
    if (!this.selectedLoi) {
      this.instructionTypes = []; // Reset instruction types if no LOI is selected
      this.selectedInstruction = ''; // Clear selected instruction
      return;
    }
    const token = this.getCookie('jwt');
    console.log('Retrieved Token:1', token);
    axios
      .get(`http://localhost:5000/instruction-types/loi/${this.selectedLoi}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    const token = this.getCookie('jwt');
    console.log('Retrieved Token:1', token);
    axios
      .get(`http://localhost:5000/parameters/instruction/${this.selectedInstruction}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
        this.parameters = response.data.data.map((item: any) => ({
          _id: item._id,
          parameter_msg: item.parameterMsg,
        }));
        console.log(this.parameters);
      })
      .catch((error) => {
        console.error('Error fetching parameters:', error);
      });
  }

  isSelected(paramId: string): boolean {
    return this.selectedParameters.includes(paramId);
  }

  // Toggle the selection of a parameter
  toggleSelection(paramId: string): void {
    const index = this.selectedParameters.indexOf(paramId);
    if (index === -1) {
      this.selectedParameters.push(paramId); // Add to selected if not already present
    } else {
      this.selectedParameters.splice(index, 1); // Remove if already selected
    }

    if (this.selectedParameters.length > 0) {
      // If at least one parameter is selected, clear the error message
      this.parametersError = null;
    }
  }

  submitForm(): void {
    this.isSubmitted = true;
    this.clientNameError = null;
    this.caseReferenceError = null;
    this.dateError = null;
    this.loiError = null;
    this.instructionError = null;
    this.parametersError = null;

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

    // Validate case reference
    if (!this.caseReference) {
      this.caseReferenceError = 'Case Reference Number is required.';
    }

    // Validate date of breach
    if (!this.dateOfBranch) {
      this.dateError = 'Date is required.';
    } else if (!this.dateOfBranch.match(/^\d{4}-\d{2}-\d{2}$/)) {
      this.dateError = 'Invalid date format. Please enter a valid date.';
    }

    // Validate LOI Type
    if (!this.selectedLoi) {
      this.loiError = 'LOI Type is required.';
    }

    // Validate Instruction Type
    if (!this.selectedInstruction) {
      this.instructionError = 'Instruction Type is required.';
    }

    // Validate Parameters
    if (this.selectedParameters.length === 0) {
      this.parametersError = 'At least one parameter should be selected.';
    }

    // If no errors, proceed with form submission
    if (
      !this.clientNameError &&
      !this.caseReferenceError &&
      !this.dateError &&
      !this.loiError &&
      !this.instructionError &&
      !this.parametersError
    ) {
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
        parentId: null,
        clientName: this.clientName,
        refNumber: this.caseReference,
        dateOfBreach: this.dateOfBranch,
        caseStatus: 'uploaded',
        parameters: this.selectedParameters, // Pass only IDs
        files: [],
        isLoi: !!this.selectedLoi,
        isDeleted: false,
        createdBy: userId, // Set createdBy from the decoded token
        modifiedBy: userId, // Set modifiedBy from the decoded token
      };

      console.log('Form data:', formData);

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
          console.log('Case created successfully:', response.data);
          this.router.navigate(['/case-management']);
        })
        .catch((error) => {
          console.error(
            'Error creating case:',
            error.response?.data || error.message
          );
          // Handle error - e.g., show an error message
        });
    }
  }
}