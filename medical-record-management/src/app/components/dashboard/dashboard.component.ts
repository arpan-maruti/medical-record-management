import { Component } from '@angular/core';
import { MainLayoutComponent } from '../dashboard-items/main-layout/main-layout.component';
import { SidebarComponent } from '../dashboard-items/sidebar/sidebar.component';
import { NavbarComponent } from '../dashboard-items/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [MainLayoutComponent,SidebarComponent,NavbarComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
