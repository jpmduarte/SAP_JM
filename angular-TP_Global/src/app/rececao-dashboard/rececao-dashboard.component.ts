import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rececao-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rececao-dashboard.component.html',
  styleUrl: './rececao-dashboard.component.css'
})
export class RececaoDashboardComponent {

  show = true;
  showLogoutPopup = false;

  constructor(private router: Router) {}

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }

}
