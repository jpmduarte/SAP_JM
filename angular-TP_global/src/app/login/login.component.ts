import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  
})
export class LoginComponent {

  showLoginForm = true;

  toggleForm(event: Event): void {
    event.preventDefault();
    this.showLoginForm = !this.showLoginForm;
  }
}
