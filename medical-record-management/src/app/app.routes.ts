import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OtpComponent } from './components/otp/otp.component';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';
import { RegisterComponent } from './components/register/register.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/dashboard-items/profile/profile.component';

export const routes: Routes = [

    {path:'', component: LoginComponent, pathMatch:'full'},
    {path:'otp', component: OtpComponent, pathMatch:'full'},
    {path:'customalert', component: CustomAlertComponent, pathMatch:'full'},
    {path:'register', component: RegisterComponent, pathMatch:'full'},
    {path:'page-not-found', component: PageNotFoundComponent},
    {path:'dashboard', component: DashboardComponent},
    {path:'profile',component:ProfileComponent, pathMatch:'full'},
    {path:'**', redirectTo:'/page-not-found'}, 
];
