import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
  pedidosJunta: any;
  pedidoAva: any = [];
  selectedPedido: any;
  validateForm: any = {
    descricao: '',
    nivel_invalidez: '',
  }
  rejectForm: any ={
    descricao: '',
  };
  i: number = 0;

  constructor(private router: Router, private http: HttpClient,private activatedRoute: ActivatedRoute) {}

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }



  
  ngOnInit(): void {
    this.fetchPedidos();
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
  
  fetchPedidos() {
    const email = this.activatedRoute.snapshot.queryParams['email'];
    this.http.get(`http://localhost:3001/api/fetchpedidosAvaliacao?email=${email}`).subscribe(
      (response:any) => {
        console.log('pedidos avaliacao' ,response);
        this.pedidoAva = response.pedidos;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
 

  openFormPopup(selectedIndex: number, numeroUtente: string): void {
    // Set selectedPedido based on selectedIndex
    this.selectedPedido = this.pedidoAva[selectedIndex];
    console.log('Selected Pedido:', this.selectedPedido);
    this.fetchFiles(this.selectedPedido.id_pedido);
    this.showFormPopup = true;
    this.show = false;
    }

  fetchPedidosJunta() {
    const email = this.activatedRoute.snapshot.queryParams['email'];
  
    this.http.get(`http://localhost:3001/api/fetchpedidosJunta?email=${email}`).subscribe(
      (response) => {
        console.log('pedido juntaaa '+ response);
        this.pedidosJunta = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  validatePedido(): void {
    const params = { id_pedido: this.selectedPedido.id_pedido };
    const body = {
      descricao: this.validateForm.descricao,
      nivel_invalidez: this.validateForm.nivel_invalidez,
    };
    console.log('body', body);
    this.http
    .put<any>(`http://localhost:3001/api/validatePedido/${this.selectedPedido.id_pedido}`, body)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.fetchPedidos();
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  
  }
  
rejectPedido(): void {
  
  const body = {
    descricao: this.rejectForm.descricao,
  };
  console.log('body', body);

  this.http
    .put<any>(`http://localhost:3001/api/rejectPedido/${this.selectedPedido.id_pedido}`, body,)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.fetchPedidos();
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
  this.showFormPopup = false;
    this.rejected = false;
    this.accepted = false;
}

  sort(property: string) {
  }
}
