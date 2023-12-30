import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utente-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './utente-dashboard.component.html',
  styleUrls: ['./utente-dashboard.component.css']
})
export class UtenteDashboardComponent {
  
  showLogoutPopup = false;
  showFormPopup = false;
  showPreviousAssessmentField: boolean = false;

  constructor(private router: Router) {}

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  toggleFormPopup() {
    this.showFormPopup = !this.showFormPopup;
  }

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }

  onSubmissionStatusChange(value: string): void {
    if (value === 'sim') {
      this.showPreviousAssessmentField = true;
    } else {
      this.showPreviousAssessmentField = false;
    }
  }
}
