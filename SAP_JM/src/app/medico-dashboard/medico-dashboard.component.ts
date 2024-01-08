import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medico-dashboard',
  templateUrl: './medico-dashboard.component.html',
  styleUrl: './medico-dashboard.component.css'
})
export class MedicoDashboardComponent {
  
  show = true;
  showLogoutPopup = false;

  constructor(private router: Router) {}

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }
}