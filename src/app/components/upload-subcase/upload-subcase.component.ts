import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import axios from 'axios';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment';
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
  instructionError: string | null = null;
  isSubmitted: boolean = false;
  token: string | null = null;

  // Flag to indicate if the component is in viewOnly mode
  viewOnly: boolean = false;
  caseData: any = null;

  constructor(
    private dataService: DataService,
    private cookieService: CookieService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      if (navigation.extras.state['caseData']) {
        this.caseData = navigation.extras.state['caseData'];
        this.clientName = this.caseData.client_name || '';
        // If available, use a parent case property; fall back to ref_number
        this.parentCaseReference = this.caseData.parent_id?.clientName || this.caseData.ref_number || '';
        this.subCaseReference = this.caseData.ref_number || '';
        this.dateOfBranch = this.caseData.date_of_breach || '';
        if (this.caseData.parameters && this.caseData.parameters.length > 0) {
          // For updating later (editable mode)
          this.selectedLoi = this.caseData.parameters[0].instructionId?.loiId?._id || '';
          this.selectedInstruction = this.caseData.parameters[0].instructionId?.instructionMsg || '';
          // For view mode display
          this.selectedLoiMsg = this.caseData.parameters[0].instructionId?.loiId?.loiMsg || '';
          this.selectedInstructionMsg = this.caseData.parameters[0].instructionId?.instructionMsg || '';
          this.selectedParametersView = this.caseData.parameters;
        }
      } else {
        this.clientName = navigation.extras.state['clientName'] || '';
        this.parentCaseReference = navigation.extras.state['parentCaseReference'] || '';
        this.caseData = {
          parentCaseId: navigation.extras.state['parentCaseId'],
          client_name: this.clientName,
          ref_number: this.parentCaseReference
        };
      }
      if (navigation.extras.state['viewOnly'] !== undefined) {
        this.viewOnly = navigation.extras.state['viewOnly'];
      }
    }
  }

  ngOnInit(): void {
    this.token = this.getCookie('jwt');
    // In view mode, we don't need to fetch LOI or instruction types
    if (!this.viewOnly) {
      this.fetchLoiTypes().then(() => {
        if (this.selectedLoi) {
          this.onLoiChange();
        }
      });
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
  }

  async fetchLoiTypes(): Promise<void> {
    if (!this.token) {
      console.error('No JWT token found.');
      return;
    }
    try {
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
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching LOI Types:', error);
    }
  }

  onLoiChange(): void {
    if (!this.selectedLoi) {
      this.instructionTypes = [];
      this.selectedInstruction = '';
      return;
    }
    if (!this.token) return;
    axios
      .get(`${environment.apiUrl}/instruction-types/loi/${this.selectedLoi}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(response => {
        this.instructionTypes = response.data.data.map((item: any) => ({
          _id: item._id,
          instruction_msg: item.instruction_msg,
        }));
      })
      .catch(error => {
        console.error('Error fetching Instruction Types:', error);
      });
  }

  onInstructionChange(): void {
    if (!this.selectedInstruction) {
      this.parameters = [];
      return;
    }
    if (!this.token) return;
    axios
      .get(`${environment.apiUrl}/parameters/instruction/${this.selectedInstruction}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(response => {
        this.parameters = response.data.data.map((item: any) => ({
          _id: item._id,
          parameter_msg: item.parameter_msg,
        }));
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

  getParameterMsg(param: any): string {
    return (param && (param.parameterMsg || param.parameter_msg)) || '';
  }

  submitForm(): void {
    this.isSubmitted = true;
    // Reset error messages
    this.subCaseReferenceError = null;
    this.dateError = null;
    this.parametersError = null;
    this.loiError = null;
    this.instructionError = null;

    // Validate fields
    if (!this.subCaseReference || this.subCaseReference.trim() === '') {
      this.subCaseReferenceError = 'Subcase Reference is required.';
    }
    if (!this.dateOfBranch) {
      this.dateError = 'Date is required.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(this.dateOfBranch)) {
      this.dateError = 'Invalid date format. Use YYYY-MM-DD.';
    }
    if (!this.selectedLoi) {
      this.loiError = 'LOI Type is required.';
    }
    if (!this.selectedInstruction) {
      this.instructionError = 'Instruction Type is required.';
    }
    if (Object.values(this.selectedParameters).every(val => !val)) {
      this.parametersError = 'At least one parameter must be selected.';
    }
    if (this.subCaseReferenceError || this.dateError || this.parametersError || this.loiError || this.instructionError) {
      console.error('Validation errors', {
        subCaseReferenceError: this.subCaseReferenceError,
        dateError: this.dateError,
        loiError: this.loiError,
        instructionError: this.instructionError,
        parametersError: this.parametersError
      });
      return;
    }

    // Decode JWT token to extract user ID
    let userId: string | null = null;
    try {
      const decodedToken: any = jwtDecode(this.token!);
      userId = decodedToken?.id || null;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
    if (!userId) {
      console.error('Unable to extract user ID from token.');
      return;
    }

    const formData = {
      parentId: this.caseData ? this.caseData.parentCaseId : null,
      clientName: this.clientName.trim(),
      refNumber: this.subCaseReference.trim(),
      dateOfBreach: this.dateOfBranch.trim(),
      caseStatus: 'uploaded',
      parameters: Object.keys(this.selectedParameters).filter(key => this.selectedParameters[key]),
      files: [],
      isLoi: !!this.selectedLoi,
      isDeleted: false,
      createdBy: userId,
      modifiedBy: userId,
    };

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
        this.router.navigate(['/case-management']);
      })
      .catch(error => {
        console.error('Error creating subcase:', error.response?.data || error.message);
      });
  }
}