import { Component } from '@angular/core';
import { MainLayoutComponent } from '../dashboard-items/main-layout/main-layout.component';
import { SidebarComponent } from '../dashboard-items/sidebar/sidebar.component';
import { NavbarComponent } from '../dashboard-items/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [MainLayoutComponent,SidebarComponent,NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
