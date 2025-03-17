import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-subcase',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './upload-subcase.component.html',
  styleUrls: ['./upload-subcase.component.css']
})
export class UploadSubcaseComponent implements OnInit {
  // Case details
  clientName: string = '';
  parentCaseReference: string = '';
  subCaseReference: string = '';
  dateOfBranch: string = '';
  loiTypes: any[] = [];
  // For editable mode (holds backend IDs)
  selectedLoi: string = '';
  selectedInstruction: string = '';
  // For view mode (display texts)
  selectedLoiMsg: string = '';
  selectedInstructionMsg: string = '';
  instructionTypes: any[] = [];
  parameters: any[] = [];
  selectedParameters: { [key: string]: boolean } = {};
  // For view-only mode
  selectedParametersView: any[] = [];

  // Validation errors
  subCaseReferenceError: string | null = null;
  dateError: string | null = null;
  parametersError: string | null = null;
  loiError: string | null = null;
  loiFileError: string | null = null;
  loiFileErrorMessage: string | null = null;
  instructionError: string | null = null;
  isSubmitted: boolean = false;
  token: string | null = null;
  caseId: string = '';
  loiFile: File | null = null;
  loiFileName: string = '';
  uploadedLoiFileMetadata: any = null;

  // Flag to indicate if the component is in viewOnly mode
  viewOnly: boolean = false;
  caseData: any = null;

  constructor(
      private cookieService: CookieService,
      private route: ActivatedRoute,
      private router: Router,
      private toastr: ToastrService
    ) {
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation?.extras.state) {
    //   if (navigation.extras.state['caseData']) {
    //     this.caseData = navigation.extras.state['caseData'];
    //     this.clientName = this.caseData.client_name || '';
    //     // Use parentCaseReference from caseData if available; else ref_number
    //     this.parentCaseReference = this.caseData.parent_id?.clientName || this.caseData.ref_number || '';
    //     this.subCaseReference = this.caseData.ref_number || '';
    //     this.dateOfBranch = this.caseData.date_of_breach || '';
    //     if (this.caseData.parameters && this.caseData.parameters.length > 0) {
    //       // For updating later (editable mode)
    //       this.selectedLoi = this.caseData.parameters[0].instructionId?.loiId?._id || '';
    //       this.selectedInstruction = this.caseData.parameters[0].instructionId?.instructionMsg || '';
    //       // For view mode display
    //       this.selectedLoiMsg = this.caseData.parameters[0].instructionId?.loiId?.loiMsg || '';
    //       this.selectedInstructionMsg = this.caseData.parameters[0].instructionId?.instructionMsg || '';
    //       this.selectedParametersView = this.caseData.parameters;
    //     }
    //   } else {
    //     this.clientName = navigation.extras.state['clientName'] || '';
    //     this.parentCaseReference = navigation.extras.state['parentCaseReference'] || '';
    //     this.caseData = {
    //       parentCaseId: navigation.extras.state['parentCaseId'],
    //       client_name: this.clientName,
    //       ref_number: this.parentCaseReference
    //     };
    //   }
    //   if (navigation.extras.state['viewOnly'] !== undefined) {
    //     this.viewOnly = navigation.extras.state['viewOnly'];
    //   }
    // }
  }


  async fetchCaseData(): Promise<void> {
    const token = this.cookieService.get('jwt');
    
    if (!token) {
      // this.toastr.error('JWT token not available', 'Error');
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
  async ngOnInit(): Promise<void> {


    this.token = this.getCookie('jwt');
    
    this.caseId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.caseId) {
      this.toastr.error('Case ID is required', 'Error');
      this.router.navigate(['/case-management']); // Redirect to a safe page
      return;
    }
  
    // Determine if the request is for View Mode or Upload Mode based on the URL
    const currentUrl = this.router.url;
    if (currentUrl.includes('/sub-case-view')) {
      this.viewOnly = true; // Set viewOnly to true for sub-case-view
    } else if (currentUrl.includes('/upload-sub-case')) {
      this.viewOnly = false; // Set viewOnly to false for upload-sub-case
    } else {
      this.toastr.error('Invalid URL', 'Error');
      this.router.navigate(['/case-management']); // Redirect to a safe page
      return;
    }
  
    if (this.viewOnly) {
      // Fetch case data for View Mode
      await this.fetchCaseData();
    } else {
      // Fetch clientName and parentCaseReference for Upload Mode
      await this.fetchClientAndParentCaseDetails();
    }
  
    // Populate form fields based on the fetched data
    if (this.caseData) {
      console.log(this.caseData);
      this.clientName = this.caseData.clientName;
      this.parentCaseReference = this.caseData.parentId.refNumber;
      this.subCaseReference = this.caseData.refNumber;
      this.dateOfBranch = this.caseData.dateOfBreach;
  
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
  

    if (!this.viewOnly) {
      await this.fetchLoiTypes();
      if (this.selectedLoi) {
        await this.onLoiChange();
      }
    }
  }

  async fetchClientAndParentCaseDetails(): Promise<void> {
    const token = this.cookieService.get('jwt');
    
    if (!token) {
      // this.toastr.error('JWT token not available', 'Error');
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
        console.log(response.data);
        this.clientName = response.data.data.clientName;
        this.parentCaseReference = response.data.data.refNumber;
      } else {
        this.toastr.error(response.data.message, 'Error');
      }
    } catch (error) {
      console.error('Error fetching client and parent case details:', error);
      this.toastr.error('Failed to fetch client and parent case details', 'Error');
    }
  }

  getCookie(name: string): string | null {
    return this.cookieService.get(name) || null;
  }

  onInputChange(): void {
    // Clear error messages on input change
    this.subCaseReferenceError = null;
    this.dateError = null;
    this.parametersError = null;
    this.loiError = null;
    this.instructionError = null;
    this.loiFileError = null;

  }

  // Caching LOI Types similar to Upload New Case Component
  async fetchLoiTypes(): Promise<void> {
    if (this.viewOnly) {
      return;
    }
    if (!this.token) {
      // this.toastr.error('JWT token not found', 'Error');
      // console.error('No JWT token found.');
      return;
    }
    try {
      const cacheName = 'loi-cache';
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match('/loiTypes');

      if (cachedResponse) {
        this.loiTypes = await cachedResponse.json();
        console.log('Loaded LOI Types from Cache Storage in Subcase:', this.loiTypes);
        return;
      }

      const response = await axios.get(`${environment.apiUrl}/loiType`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data && Array.isArray(response.data.data)) {
        this.loiTypes = response.data.data.map((item: any) => ({
          _id: item._id,
          loi_msg: item.loi_msg,
        }));
        await cache.put('/loiTypes', new Response(JSON.stringify(this.loiTypes)));
        console.log('Fetched and stored LOI Types in Cache Storage in Subcase:', this.loiTypes);
      } else {
        console.error('Unexpected response structure:', response.data);
        this.toastr.error('Unexpected response from LOI Types API', 'Error');
      }
    } catch (error) {
      console.error('Error fetching LOI Types:', error);
      this.toastr.error('Error fetching LOI Types', 'Error');
    }
  }

  // Caching Instruction Types per LOI
  async onLoiChange(): Promise<void> {
    if (this.viewOnly) {
      return;
    }
    if (!this.selectedLoi) {
      this.instructionTypes = [];
      this.selectedInstruction = '';
      return;
    }

    if (!this.token) return;
    try {
      const cacheName = 'instruction-cache';
      const cache = await caches.open(cacheName);
      const cacheKey = `/instructionTypes/${this.selectedLoi}`;
      const cachedResponse = await cache.match(cacheKey);

      if (cachedResponse) {
        this.instructionTypes = await cachedResponse.json();
        console.log(`Loaded Instruction Types for LOI ${this.selectedLoi} from Cache Storage in Subcase:`, this.instructionTypes);
        return;
      }

      const response = await axios.get(`${environment.apiUrl}/instruction-types/loi/${this.selectedLoi}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      this.instructionTypes = response.data.data.map((item: any) => ({
        _id: item._id,
        instruction_msg: item.instruction_msg,
      }));

      await cache.put(cacheKey, new Response(JSON.stringify(this.instructionTypes)));
      console.log(`Fetched and stored Instruction Types for LOI ${this.selectedLoi} in Cache Storage in Subcase:`, this.instructionTypes);
    } catch (error) {
      console.error('Error fetching Instruction Types:', error);
      this.toastr.error('Error fetching Instruction Types', 'Error');
    }
  }

  // Caching Parameters per Instruction
  async onInstructionChange(): Promise<void> {
    if (this.viewOnly) {
      return;
    }
    if (!this.selectedInstruction) {
      this.parameters = [];
      return;
    }

    if (!this.token) return;
    try {
      const cacheName = 'parameter-cache';
      const cache = await caches.open(cacheName);
      const cacheKey = `/parameters/${this.selectedInstruction}`;
      const cachedResponse = await cache.match(cacheKey);

      if (cachedResponse) {
        this.parameters = await cachedResponse.json();
        console.log(`Loaded Parameters for Instruction ${this.selectedInstruction} from Cache Storage in Subcase:`, this.parameters);
        return;
      }

      const response = await axios.get(`${environment.apiUrl}/parameters/instruction/${this.selectedInstruction}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      this.parameters = response.data.data.map((item: any) => ({
        _id: item._id,
        parameter_msg: item.parameter_msg,
      }));

      await cache.put(cacheKey, new Response(JSON.stringify(this.parameters)));
      console.log(`Fetched and stored Parameters for Instruction ${this.selectedInstruction} in Cache Storage in Subcase:`, this.parameters);
    } catch (error) {
      console.error('Error fetching parameters:', error);
      this.toastr.error('Error fetching parameters', 'Error');
    }
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

  getParameterMsg(param: any): string {
    return (param && (param.parameterMsg || param.parameter_msg)) || '';
  }

  // Method triggered when a file is selected via the file input
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
  // Upload the selected LOI file and store the metadata
  uploadLoiFile(file: File): void {
    const token = this.cookieService.get('jwt');
    if (!this.token) {
      console.error('No JWT token available for file upload.');
      this.toastr.error('No JWT token available', 'File Upload');
      return;
    }
    const userId = this.getUserIdFromJWT();
    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const formData = new FormData();
    if (!userId) {
      console.error('Error decoding JWT token:');
      this.toastr.error('Error decoding token', 'File Upload');
    }
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', 'loi');
    formData.append('createdBy', userId);
    formData.append('modifiedBy', userId);
    formData.append('fileFormat', extension);
    // Using parentCaseId from caseData for subcase file upload
    axios.post(`${environment.apiUrl}/file`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    })
      .then(response => {
        console.log('LOI file uploaded successfully:', response.data);
        this.uploadedLoiFileMetadata = response.data.data;
        this.loiFileError = null;
        this.toastr.success('LOI file uploaded successfully', 'File Upload');
      })
      .catch(error => {
        console.error('Error uploading LOI file:', error);
        this.toastr.error('Error uploading LOI file', 'File Upload');
      });
  }

  submitForm(): void {
    this.isSubmitted = true;
    // Reset error messages
    this.subCaseReferenceError = null;
    this.dateError = null;
    this.parametersError = null;
    this.loiError = null;
    this.instructionError = null;
    this.loiFileError = null;

    // Validate fields
    if (!this.subCaseReference || this.subCaseReference.trim() === '') {
      this.subCaseReferenceError = 'Subcase Reference is required.';
    }
    if (!this.dateOfBranch) {
      this.dateError = 'Date is required.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(this.dateOfBranch)) {
      this.dateError = 'Invalid date format. Use YYYY-MM-DD.';
    } else if (this.dateOfBranch > new Date().toISOString().split('T')[0]) {
      this.dateError = 'Date cannot be in the future.';
    }
    if (!this.selectedLoi) {
      this.loiError = 'LOI Type is required.';
    }
    if (!this.selectedInstruction) {
      this.instructionError = 'Instruction Type is required.';
    }
    if(!this.loiFile) {
      this.loiFileError = 'LOI file is required.';
    }
    if (Object.values(this.selectedParameters).every(val => !val)) {
      this.parametersError = 'At least one parameter must be selected.';
    }
    if (this.subCaseReferenceError || this.dateError || this.parametersError || this.loiError || this.instructionError || this.loiFileError) {
      this.toastr.error('Please correct form errors.', 'Validation Error');
      console.error('Validation errors', {
        subCaseReferenceError: this.subCaseReferenceError,
        dateError: this.dateError,
        loiError: this.loiError,
        instructionError: this.instructionError,
        parametersError: this.parametersError,
        loiFileError: this.loiFileError
      });
      return;
    }

    let userId: string | null = null;
    try {
      const decodedToken: any = jwtDecode(this.token!);
      userId = decodedToken?.id || null;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      this.toastr.error('Error decoding token', 'Error');
    }
    if (!userId) {
      console.error('Unable to extract user ID from token.');
      this.toastr.error('User authentication error', 'Error');
      return;
    }

    const formData = {
      parentId: this.caseId,
      clientName: this.clientName.trim(),
      refNumber: this.subCaseReference.trim(),
      dateOfBreach: this.dateOfBranch.trim(),
      caseStatus: 'uploaded',
      parameters: Object.keys(this.selectedParameters).filter(key => this.selectedParameters[key]),
      files: [] as string[],
      isLoi: !!this.selectedLoi,
      isDeleted: false,
      createdBy: userId,
      modifiedBy: userId,
    };

    if (this.uploadedLoiFileMetadata && this.uploadedLoiFileMetadata.data._id) {
      formData.files.push(this.uploadedLoiFileMetadata.data._id);
    }

    console.log('Submitting form data:', formData);

    axios
      .post(`${environment.apiUrl}/case/`, formData, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(response => {
        console.log('Subcase created successfully:', response.data);
        this.toastr.success('Subcase created successfully', 'Success');
        this.router.navigate(['/case-management']);
      })
      .catch(error => {
        console.error('Error creating subcase:', error.response?.data || error.message);
        // this.toastr.error('Error creating subcase', 'Error');
        this.toastr.error(error.response?.data?.error || error.response?.data?.message|| 'Error creating case', 'Error');
        
      });
  }
}