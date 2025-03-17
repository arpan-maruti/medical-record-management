import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import phoneValidationData from '../../../assets/country-phone-validation.json';
import { PhoneMaskService } from '../../services/phone-mask.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [NgxMaskDirective,MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css',
  providers: [provideNgxMask()],
})
export class EditUserDialogComponent implements OnInit {
  editUserForm!: FormGroup;
  isLoading = false;
  isEditing = false; // Track if user is in edit mode
  originalData: any = {}; // Store original user data
  countryList: any = phoneValidationData;
  phoneMask: string = '';
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private cookieService: CookieService,
    private phoneMaskService: PhoneMaskService,
    private toastr: ToastrService, // Inject ToastrService
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchUserDetails();
  }

  initForm() {
    this.editUserForm = this.fb.group({
      first_name: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      last_name: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      country_code: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\+\d{1,3}$/)]],
      phone_number: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      user_role: [{ value: '', disabled: true }, Validators.required]
    });
  }

  async fetchUserDetails() {
    this.isLoading = true;
    try {
      const token = this.cookieService.get('jwt');
      const response = await axios.get(`${environment.apiUrl}/user/${this.data.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      this.originalData = response.data.data; // Store original data
      this.editUserForm.patchValue(response.data.data);
      console.log(this.originalData);
    } catch (error: any) {
      this.toastr.error('Failed to fetch user details', 'Error');
      console.error('Error fetching user data:', error.response?.data || error.message);
    } finally {
      this.isLoading = false;
    }
  }

  enableEdit() {
    this.isEditing = true;
    this.editUserForm.enable(); // Enable all fields
  }

  async saveChanges() {
    if (this.editUserForm.invalid) {
      this.toastr.warning('Please fill out all required fields correctly', 'Validation Error');
      return;
    }

    this.isLoading = true;
    try {
      const token = this.cookieService.get('jwt');
  
      // Mapping form fields to API field names
      const fieldMapping: any = {
        first_name: "firstName",
        last_name: "lastName",
        email: "email",
        country_code: "countryCode",
        phone_number: "phoneNumber",
        user_role: "userRole"
      };
  
      const updatedValues: any = {};
      Object.keys(this.editUserForm.value).forEach(key => {
        if (this.editUserForm.value[key] !== this.originalData[key]) {
          const mappedKey = fieldMapping[key] || key; // Use mapped key if available
          updatedValues[mappedKey] = this.editUserForm.value[key];
        }
      });
  
      if (Object.keys(updatedValues).length > 0) {
        console.log(updatedValues); // Check the formatted payload before sending
        await axios.patch(`${environment.apiUrl}/user/${this.data.userId}`, updatedValues, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        this.toastr.success('User details updated successfully', 'Success');
      } else {
        this.toastr.info('No changes detected', 'Info');
      }
  
      this.dialogRef.close(true); // Close dialog with success
    } catch (error: any) {
      this.toastr.error('Failed to update user details', 'Error');
      console.error('Error updating user:', error.response?.data || error.message);
    } finally {
      this.isLoading = false;
    }
  }
  updatePhoneMask() {
    const selectedCountryCode = this.editUserForm.get('country_code')?.value;
    if (selectedCountryCode) {
      const country = this.countryList.find(
        (c: { countryCallingCode: string }) => c.countryCallingCode === selectedCountryCode
      );
      let isoCode = selectedCountryCode; 
      if (country) {
        isoCode = country.countryCode;
      }
      this.phoneMask = this.phoneMaskService.getMask(isoCode);
      if (!this.phoneMask) {
        console.warn(`Mask not found for country code: ${isoCode}`);
        this.phoneMask = '000-000-0000';
      }
    }
  }
  closeDialog() {
    this.dialogRef.close(false);
  }
}
