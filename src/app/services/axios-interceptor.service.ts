import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosInterceptorService {

  constructor(private router: Router) {
    // Set up the response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        console.log('AxiosInterceptorService error', error);
        if (error.response && error.response.status === 401) {
          // Redirect to login page on 401

          this.router.navigate(['/']);
        }
        return Promise.reject(error);
      }
    );
  }
}