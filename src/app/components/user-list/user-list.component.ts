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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CookieService } from 'ngx-cookie-service';
import { trigger, state, style, transition, animate } from '@angular/animations';
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
    MatProgressSpinnerModule
  ],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.3s ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('hoverEffect', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.1)' })),
      transition('normal => hovered', animate('0.2s ease-in')),
      transition('hovered => normal', animate('0.2s ease-out')),
    ]),
  ],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'role',
    'status',
    'actions',
  ];
  users: any[] = [];
  totalUsers = 0;
  pageSize = 10;
  pageIndex = 0;
  searchQuery = '';
  sortField = 'first_name';
  sortOrder = 'asc';
  isLoading = false;
  hoverState: 'normal' | 'hovered' = 'normal'; // Default state is 'normal'

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    this.isLoading = true;
    try {
      const token = this.cookieService.get('jwt');
      const response = await axios.get(`${environment.apiUrl}/user`, {
        params: {
          page: this.pageIndex + 1,
          limit: this.pageSize,
          search: this.searchQuery,
          sortField: this.sortField,
          sortOrder: this.sortOrder,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      this.users = response.data.data.users;
      this.totalUsers = response.data.total;
    } catch (error) {
      // console.error('Error fetching users:', error);
    } finally {
      this.isLoading = false;
    }
  }
  onSearchChange(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.loadUsers();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadUsers();
  }

  onSortChange(sort: Sort) {
    this.sortField = sort.active;
    this.sortOrder = sort.direction || 'asc';
    this.loadUsers();
  }

  editUser(userId: string) {
    console.log('Edit user:', userId);
  }

  deleteUser(userId: string) {
    console.log('Delete user:', userId);
  }

  viewUser(userId: string) {
    console.log('View user:', userId);
  }
}
