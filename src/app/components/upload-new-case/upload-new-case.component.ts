import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

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
  selectedParametersView: string[] = [];
  // Validation errors
  isSubmitted: boolean = false;
  clientNameError: string | null = null;
  caseReferenceError: string | null = null;
  dateError: string | null = null;
  loiError: string | null = null;
  instructionError: string | null = null;
  parametersError: string | null = null;

  // New properties for file upload
  loiFile: File | null = null;
  loiFileName: string = '';
  uploadedLoiFileMetadata: any = null;

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
      this.clientName = this.caseData.client_name;
      this.caseReference = this.caseData.ref_number;
      this.dateOfBranch = this.caseData.date_of_breach; // Adjust based on your data structure
  
      // Populate LOI Type
      this.selectedLoi = this.caseData.parameters[0].instructionId.loiId.loiMsg || "hello";
      console.log("loi:" + this.selectedLoi);
  
      // Populate Instruction Type
      this.selectedInstruction = this.caseData.parameters[0].instructionId.instructionMsg;
      console.log("instr:" + this.selectedInstruction);
  
      // Populate Parameters
      this.selectedParametersView = this.caseData.parameters || [];
      console.log(this.selectedParametersView);
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

  getParameterMsg(param: any): string {
    return (param && (param.parameterMsg || param.parameter_msg)) || '';
  }

  // Fetch LOI Types from the API
  async fetchLoiTypes(): Promise<void> {
    const token = this.getCookie('jwt');
    console.log('Retrieved Token:', token);
    if (!token) {
      return;
    }
    try {
      const response = await axios.get(`${environment.apiUrl}/loiType`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log(response.data);
      if (response.data && Array.isArray(response.data.data)) {
        this.loiTypes = response.data.data.map((item: any) => ({
          _id: item._id,
          loi_msg: item.loi_msg,
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
      this.instructionTypes = [];
      this.selectedInstruction = '';
      return;
    }
    const token = this.getCookie('jwt');
    console.log('Retrieved Token:', token);
    axios
      .get(`${environment.apiUrl}/instruction-types/loi/${this.selectedLoi}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        this.instructionTypes = response.data.data.map((item: any) => ({
          _id: item._id,
          instruction_msg: item.instruction_msg,
        }));
        console.log(this.instructionTypes);
      })
      .catch((error) => {
        console.error('Error fetching Instruction Types:', error);
      });
  }

  onInstructionChange(): void {
    if (!this.selectedInstruction) {
      this.parameters = [];
      return;
    }
    const token = this.getCookie('jwt');
    console.log('Retrieved Token:', token);
    axios
      .get(`${environment.apiUrl}/parameters/instruction/${this.selectedInstruction}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        this.parameters = response.data.data.map((item: any) => ({
          _id: item._id,
          parameter_msg: item.parameter_msg,
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
      this.selectedParameters.push(paramId);
    } else {
      this.selectedParameters.splice(index, 1);
    }
    if (this.selectedParameters.length > 0) {
      this.parametersError = null;
    }
  }

  // New method: Triggered when a file is selected via the file input
  onLoiFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.loiFile = file;
      this.loiFileName = file.name;
      this.uploadLoiFile(file);
    }
  }

  // New method: Upload the selected LOI file and store the returned metadata
  uploadLoiFile(file: File): void {
    const token = this.getCookie('jwt');
    if (!token) {
      console.error('No JWT token available for file upload.');
      return;
    }
    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const filePath = `/files/${Date.now()}`;
    let userId = '';
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.id || decoded.userId || '';
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
    const metadata = {
      fileName: file.name,
      filePath: filePath,
      fileSize: file.size,
      fileType: 'loi',
      fileFormat: extension,
      createdBy: userId,
      modifiedBy: userId,
    };
    // Using the same API endpoint as upload-subcase
    axios
      .post(`${environment.apiUrl}/file`, metadata, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      .then(response => {
        console.log('LOI file uploaded successfully:', response.data);
        this.uploadedLoiFileMetadata = response.data.data;
      })
      .catch(error => {
        console.error('Error uploading LOI file:', error);
      });
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

    if (
      this.clientNameError ||
      this.caseReferenceError ||
      this.dateError ||
      this.loiError ||
      this.instructionError ||
      this.parametersError
    ) {
      return;
    }

    // Decode the JWT token to extract user_id
    const token = this.getCookie('jwt');
    let userId: string | null = null;
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        userId = decodedToken?.id || null;
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
    if (!userId) {
      console.error('Unable to extract user ID from JWT token.');
      return;
    }

    const formData = {
      parentId: null,
      clientName: this.clientName,
      refNumber: this.caseReference,
      dateOfBreach: this.dateOfBranch,
      caseStatus: 'uploaded',
      parameters: this.selectedParameters,
      files: [] as string[],
      isLoi: !!this.selectedLoi,
      isDeleted: false,
      createdBy: userId,
      modifiedBy: userId,
    };

    // Add the uploaded LOI file ID if available
    if (
      this.uploadedLoiFileMetadata &&
      this.uploadedLoiFileMetadata.data &&
      this.uploadedLoiFileMetadata.data._id
    ) {
      formData.files.push(this.uploadedLoiFileMetadata.data._id);
    }

    console.log('Form data:', formData);

    axios
      .post(`${environment.apiUrl}/case/`, formData, {
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
        console.error('Error creating case:', error.response?.data || error.message);
      });
  }
}