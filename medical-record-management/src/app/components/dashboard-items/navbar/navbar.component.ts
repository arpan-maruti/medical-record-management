import { ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../../data.service';
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user: any;
  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() : void {
    this.user=this.dataService.getUsers()[0];
    this.cdr.detectChanges();
  }
}
