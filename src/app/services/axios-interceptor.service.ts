import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosInterceptorService {
  private excludedRoutes = [ '/','/set-password', '/otp'];

  constructor(private router: Router, private ngZone: NgZone) {
    this.setupInterceptor();
  }

  private setupInterceptor() {
    axios.interceptors.response.use(
      response => response,
      error => {
        console.error('AxiosInterceptorService error', error);

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          const currentUrl = this.router.url;
          console.log(currentUrl);
          // Check if the current route is in the excluded list
          if (!this.excludedRoutes.includes(currentUrl)) {
            this.ngZone.run(() => {
              this.router.navigate(['/']); // Redirect to login
            });
          }
        }

        return Promise.reject(error);
      }
    );
  }
}
