import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';

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
  loiFileError: string | null = null;
  instructionError: string | null = null;
  parametersError: string | null = null;
  loiFileErrorMessage: string | null = null;
  // New properties for file upload
  loiFile: File | null = null;
  loiFileName: string = '';
  uploadedLoiFileMetadata: any = null;
  caseId: string = '';
  caseData: any;
  viewOnly: boolean = false;
  today = new Date().toISOString().split('T')[0];
  // Cache objects for reducing API calls
  private instructionTypesCache: { [loiId: string]: any[] } = {};
  private parametersCache: { [instructionId: string]: any[] } = {};

  constructor(
      
      @Inject(PLATFORM_ID) private platformId: Object,
      private cookieService: CookieService,
      private router: Router,
      private toastr: ToastrService,
      private route: ActivatedRoute
    ) {
      
    }

    async ngOnInit() {
      this.caseId = this.route.snapshot.paramMap.get('id') || '';
      
      if (this.caseId) {
        await this.fetchCaseData(); // Wait for the case data to be fetched
      }
      
      // Now that fetchCaseData has completed, check if caseData is available
      if (this.caseData) {
        console.log(this.caseData);
        // Populate basic case details
        this.clientName = this.caseData.clientName;
        this.caseReference = this.caseData.refNumber;
        this.dateOfBranch = this.caseData.dateOfBreach; // Adjust based on your data structure
    
        // Populate LOI Type
        this.selectedLoi = this.caseData.parameters[0].instructionId.loiId.loiMsg || "hello";
        console.log("loi:" + this.selectedLoi);
    
        // Populate Instruction Type
        this.selectedInstruction = this.caseData.parameters[0].instructionId.instructionMsg;
        console.log("instr:" + this.selectedInstruction);
    
        // Populate Parameters
        this.selectedParametersView = this.caseData.parameters || [];
        console.log(this.selectedParametersView);
    
        // If in viewOnly mode, skip fetching LOI types, instruction types, and parameters
        if (this.viewOnly) {
          return;
        }
      }
    
      // Fetch LOI Types and Instruction Types only if not in viewOnly mode and JWT token is available
      const token = this.getCookie('jwt');
      if (token) {
        await this.fetchLoiTypes(); // Wait for LOI types to be fetched
        if (this.selectedLoi) {
          this.onLoiChange();
        }
      } else {
        // this.toastr.error('JWT token not available', 'Error');
      }
    }
  
    async fetchCaseData(): Promise<void> {
      const token = this.cookieService.get('jwt');
      console.log(token);
      if (!token) {
        console.log("aa"+token);
        console.warn('JWT token not found, skipping API call.');
        // Optionally, redirect to login:
        // this.router.navigate(['/login']);
        return;
      }
      try {
        const response = await axios.get(`${environment.apiUrl}/case/${this.caseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        if (response.data.code === 'Success') {
          this.caseData = response.data.data;
          console.log("this is the case data", this.caseData);
          this.viewOnly = true;
        } else {
          this.toastr.error(response.data.message, 'Error');
        }
      } catch (error) {
        console.error('Error fetching case data:', error);
        // this.toastr.error('Failed to fetch case data', 'Error');
      }
    }
  getCookie(name: string): string | null {
    return this.cookieService.get(name) || null;
  }

  getParameterMsg(param: any): string {
    return (param && (param.parameterMsg || param.parameter_msg)) || '';
  }

  // Fetch LOI Types from the API only if not already fetched
  async fetchLoiTypes(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.viewOnly) {
      return;
    }
  
    try {
      const cacheName = 'loi-cache';
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match('/loiTypes');
  
      if (cachedResponse) {
        this.loiTypes = await cachedResponse.json();
        console.log('Loaded LOI Types from Cache Storage:', this.loiTypes);
        return;
      }
  
      const token = this.getCookie('jwt');
      if (!token) {
        console.warn('JWT token not found.');
        this.toastr.warning('JWT token not found', 'Warning');
        return;
      }
  
      // Fetch data from API
      const response = await axios.get(`${environment.apiUrl}/loiType`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      if (response.data && Array.isArray(response.data.data)) {
        console.log("API called: Fetching LOI Types...");
        this.loiTypes = response.data.data.map((item: any) => ({
          _id: item._id,
          loi_msg: item.loi_msg,
        }));
  
        // Store response in Cache Storage
        await cache.put('/loiTypes', new Response(JSON.stringify(this.loiTypes)));
  
        console.log('Fetched LOI Types and stored in Cache Storage:', this.loiTypes);
      } else {
        console.error('Unexpected response structure:', response.data);
        this.toastr.error('Unexpected response from LOI Types API', 'Error');
      }
    } catch (error) {
      console.error('Error fetching LOI Types:', error);
      this.toastr.error('Error fetching LOI Types', 'Error');
    }
  }
  
  onInputChange() {
    this.clientNameError = null;
    this.caseReferenceError = null;
    this.dateError = null;
    this.loiError = null;
    this.instructionError = null;
    this.parametersError = null;
    this.loiFileError = null;
  }

  async onLoiChange(): Promise<void> {
    if (this.viewOnly) {
      return;
    }
    if (!this.selectedLoi) {
      this.instructionTypes = [];
      this.selectedInstruction = '';
      return;
    }
  
    const cacheName = 'instruction-cache';
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(`/instructionTypes/${this.selectedLoi}`);
  
    if (cachedResponse) {
      this.instructionTypes = await cachedResponse.json();
      console.log(`Loaded Instruction Types for LOI ${this.selectedLoi} from Cache Storage:`, this.instructionTypes);
      return;
    }
  
    const token = this.getCookie('jwt');
    axios
      .get(`${environment.apiUrl}/instruction-types/loi/${this.selectedLoi}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(async (response) => {
        console.log("api called");
        this.instructionTypes = response.data.data.map((item: any) => ({
          _id: item._id,
          instruction_msg: item.instruction_msg,
        }));
  
        // Store in Cache Storage
        await cache.put(`/instructionTypes/${this.selectedLoi}`, new Response(JSON.stringify(this.instructionTypes)));
  
        console.log(`Fetched and stored Instruction Types for LOI ${this.selectedLoi}:`, this.instructionTypes);
      })
      .catch((error) => {
        if(!this.viewOnly){
          console.error('Error fetching Instruction Types:', error);
          this.toastr.error('Error fetching Instruction Types', 'Error');
        }
       
      });
  }
  
  async onInstructionChange(): Promise<void> {
    if (this.viewOnly) {
      return;
    }
    if (!this.selectedInstruction) {
      this.parameters = [];
      return;
    }
  
    const cacheName = 'parameter-cache';
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(`/parameters/${this.selectedInstruction}`);
  
    if (cachedResponse) {
      this.parameters = await cachedResponse.json();
      console.log(`Loaded Parameters for Instruction ${this.selectedInstruction} from Cache Storage:`, this.parameters);
      return;
    }
  
    const token = this.getCookie('jwt');
    axios
      .get(`${environment.apiUrl}/parameters/instruction/${this.selectedInstruction}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(async (response) => {
        console.log("api called");
        this.parameters = response.data.data.map((item: any) => ({
          _id: item._id,
          parameter_msg: item.parameter_msg,
        }));
  
        // Store in Cache Storage
        await cache.put(`/parameters/${this.selectedInstruction}`, new Response(JSON.stringify(this.parameters)));
  
        console.log(`Fetched and stored Parameters for Instruction ${this.selectedInstruction}:`, this.parameters);
      })
      .catch((error) => {
        console.error('Error fetching parameters:', error);
        this.toastr.error('Error fetching parameters', 'Error');
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
  
  // Triggered when a file is selected via the file input
  onLoiFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.loiFile = file;
      this.loiFileName = file.name;
      this.uploadLoiFile(file);
    }
  }
  getUserIdFromJWT(): string {
    const token = this.cookieService.get('jwt');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.userId || decoded.id || '';
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return '';
      }
    }
    return '';
  }
  file: File | null = null;
  fileName: string = '';
  // Upload the selected LOI file and store the returned metadata
  uploadLoiFile(file: File): void {
    try {
    const token = this.cookieService.get('jwt');
    if (!token) {
      console.error('No JWT token available for file upload.');
      // this.toastr.error('JWT token not available', 'File Upload');
      return;
    }
      const userId = this.getUserIdFromJWT();
    const extension = this.file?.name.split('.').pop()?.toLowerCase() || 'pdf';
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('fileType', 'loi');
      formData.append('createdBy', userId);
      formData.append('modifiedBy', userId);
      formData.append('fileFormat', extension);
    }
    axios
      .post(`${environment.apiUrl}/file`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      .then(response => {
        this.uploadedLoiFileMetadata = response.data.data;
        this.toastr.success('LOI file uploaded successfully', 'File Upload');
      })
    } catch(error) {
        console.error('Error uploading LOI file:', error);
        this.toastr.error('Error uploading LOI file', 'File Upload');
      };
  }
  
  submitForm(): void {
    this.isSubmitted = true;
    this.clientNameError = null;
    this.caseReferenceError = null;
    this.dateError = null;
    this.loiError = null;
    this.instructionError = null;
    this.parametersError = null;
    this.loiFileError = null;
  
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
    } else if(this.dateOfBranch > new Date().toISOString().split('T')[0]){
      this.dateError = 'Date of breach cannot be in the future.';
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

    if(!this.loiFile) {
      debugger;
      this.loiFileError = 'LOI file is required.';
    }
  
    if (
      this.clientNameError ||
      this.caseReferenceError ||
      this.dateError ||
      this.loiError ||
      this.instructionError ||
      this.parametersError ||
      this.loiFileError
    ) {
      this.toastr.error('Please validate all the details.', 'Validation Error');
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
        this.toastr.error('Error decoding token', 'Error');
      }
    }
    if (!userId) {
      console.error('Unable to extract user ID from JWT token.');
      this.toastr.error('User authentication error', 'Error');
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
        this.toastr.success('Case created successfully', 'Success');
        this.router.navigate(['/case-management']);
      })
      .catch((error) => {
        console.error('Error creating case:', error.response?.data || error.response.message || "Error creating case");
        this.toastr.error(error.response?.data?.error || error.response?.data?.message|| 'Error creating case', 'Error');
      });
  }

  @HostListener('window:keydown.enter', ['$event'])
  hadleKeyDownEvent(event: KeyboardEvent) {
    this.submitForm();
  }
}