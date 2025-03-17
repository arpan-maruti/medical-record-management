import { CommonModule } from '@angular/common';
import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PathFormatPipe } from '../../pipes/path-format.pipe';
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, CommonModule, PathFormatPipe],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, DoCheck {
  fullUrl: string = '';
  baseUrl: string = '';
  subRoute: string = '';
  isProfile: boolean = false;
  isUploadNewCase: boolean = false;
  title: string = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fullUrl = this.router.url;
    this.isProfile = this.fullUrl.includes('profile');
    this.isUploadNewCase = this.fullUrl.includes('upload-new-case');
  }

  ngDoCheck(): void {
    const currentUrl = this.router.url;

    if (this.fullUrl !== currentUrl) {
      this.fullUrl = currentUrl;
      this.isProfile = currentUrl.includes('profile');
      this.isUploadNewCase = currentUrl.includes('upload-new-case');
    }
    this.baseUrl = this.fullUrl.split('/')[1].replace(/-/g, ' ');
    this.subRoute = this.fullUrl.split('/').slice(2, 3).join('/');
  }
  redirectToBaseRoute() {
    this.baseUrl = this.baseUrl.replace(' ', '-');
    this.router.navigate([`/${this.baseUrl}`]);
  }
  redirectToSubRoute() {
    // this.router.navigate(['']);
  }
}
