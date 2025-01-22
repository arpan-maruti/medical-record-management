import { Component } from '@angular/core';
import { CaseListComponent } from '../case-list/case-list.component';

@Component({
  selector: 'app-main-layout',
  imports: [CaseListComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
