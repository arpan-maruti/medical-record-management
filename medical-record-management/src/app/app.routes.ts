import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OtpComponent } from './components/otp/otp.component';

export const routes: Routes = [

    {path:'', component: LoginComponent, pathMatch:'full'},
    {path:'otp', component: OtpComponent, pathMatch:'full'}
];
