import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltip
  ],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'role', 'status', 'actions'];
  users: any[] = [];
  totalUsers = 0;
  pageSize = 5;
  pageIndex = 0;
  searchQuery = '';
  sortField = 'first_name';
  sortOrder: 'asc' | 'desc' | ''= '';
  isLoading = false;
  hoverState: 'normal' | 'hovered' = 'normal';

  constructor(
    private cookieService: CookieService,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    let loadingTimeout: any;
    let loadingStarted = false;
  
    try {
      const token = this.cookieService.get('jwt');
      const apiUrl = `${environment.apiUrl}/user?page=${this.pageIndex + 1}&limit=${this.pageSize}&search=${encodeURIComponent(this.searchQuery)}&sortField=${this.sortField}&sortOrder=${this.sortOrder}`;
  
      // Function to make API request
      const fetchUsers = async () => {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        return response;
      };
  
      // Delay function to set isLoading to true after 500ms
      const delayLoading = new Promise<void>((resolve) => {
        loadingTimeout = setTimeout(() => {
          this.isLoading = true;
          loadingStarted = true;
          resolve();
        }, 100);
      });
  
      // Race between API call and delay
      const response = await Promise.race([fetchUsers(), delayLoading]);
  
      // Clear timeout if data comes before 500ms
      clearTimeout(loadingTimeout);
  
      // If response is successful and it's an axios response, process it
      if ('data' in response!) {
        this.users = response.data?.data?.users || [];
        this.totalUsers = response.data?.data?.total || 0;
      }
    } catch (error: any) {
      // this.toastr.error(error.response?.data?.message || 'Error fetching users', 'Error');
    } finally {
      // Ensure `isLoading` is set to false when the data arrives
      if (loadingStarted) {
        this.isLoading = false;
      }
    }
  }
  
  

  onSearchChange(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value.trim();
    this.pageIndex = 0; // Reset to first page when searching
    this.loadUsers();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadUsers();
  }

  onSortChange(sort: Sort) {
    const fieldMapping: { [key: string]: string } = {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phoneNumber: "phoneNumber",
      userRole: "userRole",
      isDeleted: "isDeleted",
    };

    this.sortField = fieldMapping[sort.active] || 'firstName'; // Default to firstName
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    sort.direction = this.sortOrder;

    this.loadUsers();
  }

  navigateToRegister() {
    this.router.navigate(['/register-user']);
  }

  editUser(uId: string) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: { userId: uId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers(); 
      }
    });
  }

  async toggleUserStatus(user: any) {
    const action = user.is_deleted ? 'restore' : 'delete';
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { isDeleted: user.is_deleted }
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const token = this.cookieService.get('jwt');
          const apiUrl = `${environment.apiUrl}/user/${user._id}`;
  
          await axios.patch(apiUrl, { isDeleted: !user.is_deleted }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });
  
          this.toastr.success(`User ${action}d successfully`, 'Success');
          this.loadUsers();
        } catch (error: any) {
          this.toastr.error(error.response?.data?.message || `Error ${action}ing user`, 'Error');
        }
      }
    });
  }
  

  async deleteUser(userId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this user?' }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const token = this.cookieService.get('jwt');
          const apiUrl = `${environment.apiUrl}/user/${userId}`;

          await axios.patch(apiUrl, { isDeleted: true }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });

          this.toastr.success('User deleted successfully', 'Success');
          this.loadUsers();
        } catch (error: any) {
          this.toastr.error(error.response?.data?.message || 'Error deleting user', 'Error');
        }
      }
    });
  }

  viewUser(userId: string) {
    this.toastr.info(`Viewing user details for ${userId}`, 'Info');
  }

  
  navigateToCaseManagement() {
    this.router.navigate(['/case-management']);
  }
}
