import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OtpComponent } from './components/otp/otp.component';
import { CustomAlertComponent } from './components/custom-alert/custom-alert.component';
import { RegisterComponent } from './components/register/register.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { UploadNewCaseComponent } from './components/upload-new-case/upload-new-case.component';
import { UploadSubcaseComponent } from './components/upload-subcase/upload-subcase.component';
import { TableViewComponent } from './table-view/table-view.component';
import { ViewAndLabelComponent } from './components/view-and-label/view-and-label.component'
import { AgGridComponent } from './components/ag-grid/ag-grid.component';
import { SwaggerViewerComponent } from './components/swagger-viewer/swagger-viewer.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { FileDetailsComponent } from './components/file-details/file-details.component';
import { UserListComponent } from './components/user-list/user-list.component';



export const routes: Routes = [

  

    {path:'', component: LoginComponent, pathMatch:'full'},
    {path:'otp', component: OtpComponent, pathMatch:'full'},
    {path:'customalert', component: CustomAlertComponent, pathMatch:'full'},
    {path:'register', component: RegisterComponent, pathMatch:'full'},
    {path:'a', component: AgGridComponent, pathMatch:'full'},
    {path:'swagger', component: SwaggerViewerComponent, pathMatch:'full'},
    {path: 'set-password', component:SetPasswordComponent , pathMatch:'full'},
    
    {
        path: 'case-management', 
        component: DashboardComponent,
        children: [
          {
            path: '',
            component: MainLayoutComponent,
            children: [
              { path: '', redirectTo: 'all-cases', pathMatch: 'full' },
              { path: 'all-cases', component: CaseListComponent },
              { path: 'profile', component: ProfileComponent  },
              {path: 'upload-new-case', component: UploadNewCaseComponent },
              { path: 'main-case-view/:id', component: UploadNewCaseComponent },
              { path: 'sub-case-view/:id', component: UploadSubcaseComponent },
              {path: 'upload-sub-case/:id', component: UploadSubcaseComponent },
              {
                path: 'view-label', component: ViewAndLabelComponent, 
              },
              {path: 'file-details/:id', component: FileDetailsComponent },
              {path: 'user-list', component:UserListComponent , pathMatch:'full'}
            ],
          },
        ],
      },

    {path:'page-not-found', component: PageNotFoundComponent},
    
    {path:'**', redirectTo:'/page-not-found'}, 
];
