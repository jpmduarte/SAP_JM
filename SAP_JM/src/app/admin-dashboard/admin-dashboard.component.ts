import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  showLogoutPopup = false;

  constructor(private router: Router) {}

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }
  
}
