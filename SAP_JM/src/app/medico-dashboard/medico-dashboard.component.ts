import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-medico-dashboard',
  templateUrl: './medico-dashboard.component.html',
  styleUrl: './medico-dashboard.component.css'
})
export class MedicoDashboardComponent {
  
  show = true;
  files: File[] = [];
  showLogoutPopup = false;
  p: number = 1;
  showFormPopup = false;
  rejected: boolean = false;
  accepted: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }

  fetchFiles(id_pedido: string): void {
    const params = new HttpParams().set('id_pedido', id_pedido);
  
    this.http.get<any>('http://localhost:3001/api/files', { params }).subscribe({
      next: (data) => {
        this.files = data;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
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
