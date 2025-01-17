import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-otp',
  imports: [],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {
  constructor(private router: Router) {}
  login() {
  this.router.navigate(['/']);
}

}
