import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OtpComponent } from './components/otp/otp.component';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';
import { RegisterComponent } from './components/register/register.component';
export const routes: Routes = [

    {path:'', component: LoginComponent, pathMatch:'full'},
    {path:'otp', component: OtpComponent, pathMatch:'full'},
    {path:'customalert', component: CustomAlertComponent, pathMatch:'full'},
    {path:'register', component: RegisterComponent, pathMatch:'full'}
];
