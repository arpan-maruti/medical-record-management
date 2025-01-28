import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user = {
    firstName: 'Eliza',
    lastName: 'Hart',
    role: 'Super Assistant',
    email: 'superassistant1@dentistexpertwitness.london',
    mobile: '727 - 9090 - 0909'
  };
}
