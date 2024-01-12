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
  p: number = 1;
  showFormPopup = false;
  rejected: boolean = false;
  accepted: boolean = false;

  constructor(private router: Router) {}

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }

  toggleFormPopup() {
    this.showFormPopup = !this.showFormPopup;
    this.show = !this.show;
    this.closeModal();
  }

  openPopup(state: string): void {
    if (state === 'rejected') {
        this.rejected = true;
        this.accepted = false;
    } else if (state === 'accepted') {
        this.accepted = true;
        this.rejected = false;
    }
}

closeModal(): void {
    this.rejected = false;
    this.accepted = false;
}

  sort(property: string) {
  }
}
