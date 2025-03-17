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
    MatDialogModule
    
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

  constructor(private cookieService: CookieService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    this.isLoading = true;
    try {
      const token = this.cookieService.get('jwt');

      const apiUrl = `${environment.apiUrl}/user?page=${this.pageIndex + 1}&limit=${this.pageSize}&search=${encodeURIComponent(this.searchQuery)}&sortField=${this.sortField}&sortOrder=${this.sortOrder}`;
      console.log('API URL:', apiUrl);
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      this.users = response.data?.data?.users || [];
      this.totalUsers = response.data?.data?.total || 0;
    } catch (error: any) {
      console.error('Error fetching users:', error.response?.data || error.message);
    } finally {
      this.isLoading = false;
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
    console.log('Sort:', sort);

    // Map Angular column names to backend field names
    const fieldMapping: { [key: string]: string } = {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phoneNumber: "phoneNumber",
      userRole: "userRole",
      isDeleted: "isDeleted",
    };

    // Update sort field based on selected column
    this.sortField = fieldMapping[sort.active] || 'firstName'; // Default to firstName

    // Toggle sort order: If already sorted, flip the order
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    sort.direction= this.sortOrder;
    console.log('Sort:', sort);
    // Reload users with new sorting order
    this.loadUsers();
}

  
navigateToRegister() {
  // Assuming you have a router injected
  this.router.navigate(['/register']);
}


editUser(uId: string) {
  console.log(uId)
  const dialogRef = this.dialog.open(EditUserDialogComponent, {
    data: { userId: uId }  // Ensure `userId` is correctly passed
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.loadUsers(); // Reload user list if user was updated
    }
  });
}

  async deleteUser(userId: string) {
    console.log(userId);
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
  
          console.log('User deleted successfully:', userId);
          this.loadUsers(); // Reload user list after deletion
        } catch (error: any) {
          console.error('Error deleting user:', error.response?.data || error.message);
        }
      }
    });
  }
  

  viewUser(userId: string) {
    console.log('View user:', userId);
  }
}
