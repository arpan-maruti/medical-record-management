import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AxiosInterceptorService } from './services/axios-interceptor.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private axiosInterceptor: AxiosInterceptorService) {}
  title = 'medical-record-management';
}
