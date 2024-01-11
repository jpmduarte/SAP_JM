import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-utente-dashboard',
  templateUrl: './utente-dashboard.component.html',
  styleUrls: ['./utente-dashboard.component.css'],
})
export class UtenteDashboardComponent {
  show = true;
  showLogoutPopup = false;
  showFormPopup = false;
  showPreviousAssessmentField: boolean = false;
  showSuccessPopup = false;
  files: File[] = [];



  
  primeiroPedido: any = {
    idUtente: '',
    idMedico: '',
    estado: '',
    descricao: '',
    nomeCompleto: '',
    data_nascimento:Date,
    nIdentificacao: '',
    numero_utente: '',
    nif: '',
    data_validade:Date,
    rua: '',
    codigoPostal: '',
    localidade: '',
    concelho: '',
    distrito: '',
    telemovel: '',
    email: '',
    multiuso: false,
    importacaoVeiculo: false,
    submissaoReavaliacao: false,
    dataSubmissaoReavaliacao:Date,
  };

  UtenteUSF: any = {
    id_utnete: '',
    nome_usf: ''
  };

  Current_numero_utente:string ='';

  
  constructor(private router: Router, private http: HttpClient,private activatedRoute: ActivatedRoute,) {}
  

  ngOnInit(): void {
    this.fetchNumeroUtente();
    this.fetchIDutente();
    //this.fetchPedidos();
    //this.fetchUtenteUSF();
  }
  fetchNumeroUtente() {
    const email = this.activatedRoute.snapshot.queryParams['email'];
    this.http.get(`http://localhost:3001/api/numeroUtente?email=${email}`).subscribe(
      (response: any) => {
        console.log(response);
        this.Current_numero_utente = response.numero_utente;
        this.handleUserInfoFromRNUserver();
        console.log(this.Current_numero_utente);
      
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fetchIDutente() {
    const email = this.activatedRoute.snapshot.queryParams['email'];
    this.http.get(`http://localhost:3001/api/utenteID?email=${email}`).subscribe(
      (response: any) => {
        console.log(response);
        this.primeiroPedido.idUtente = response.id_utente;
      
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleUserInfoFromRNUserver() {
    const numero_utente = this.Current_numero_utente
    console.log(numero_utente);

    const url = `http://localhost:3002/api/userinfo?numero_utente=${numero_utente}`;
  

    this.http.get(url).subscribe(
      (response: any) => {
        console.log(response);
        this.primeiroPedido.nomeCompleto = response.nome;
        this.primeiroPedido.numero_utente = response.numero_utente;
        this.primeiroPedido.data_nascimento = response.data_nascimento;
        this.primeiroPedido.data_nascimento = this.primeiroPedido.data_nascimento.substring(0,10);
        this.primeiroPedido.nIdentificacao = response.numero_cc;
        this.primeiroPedido.nif = response.nif;
        this.primeiroPedido.data_validade = response.validade_cc;
        this.primeiroPedido.data_validade = this.primeiroPedido.data_validade.substring(0,10);
        this.primeiroPedido.rua = response.rua;
        this.primeiroPedido.codigoPostal = response.codigo_postal;
        this.primeiroPedido.localidade = response.freguesia;
        this.primeiroPedido.concelho = response.concelho;
        this.primeiroPedido.distrito = response.distrito;
        this.primeiroPedido.telemovel = response.numero_telemovel;
        this.primeiroPedido.email = response.email;
        console.log(this.primeiroPedido);

      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  toggleFormPopup() {
    this.showFormPopup = !this.showFormPopup;
    this.show = !this.show;
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

  onFileChange(event: any) {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      this.files.push(selectedFiles[i]);
    }
  }

  removeFile(file: File) {
    const index = this.files.indexOf(file);
    if (index !== -1) {
      this.files.splice(index, 1);
    }
  }

  openFile(fileToOpen: File) {
    const blob = new Blob([fileToOpen], { type: fileToOpen.type });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileToOpen.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  submitForm() {
    this.showSuccessPopup = true;
    this.http.post('http://localhost:3001/api/submit/pedidoAvaliacao', this.primeiroPedido).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fetchPedidos() {
    const email = this.activatedRoute.snapshot.queryParams['email'];
  
    this.http.get(`http://localhost:3001/api/pedidos?email=${email}`).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  fetchUtenteUSF() {
    this.http.get('http://localhost:3002/api/utenteUSF').subscribe(
      (response) => {
        console.log(response);
        this.UtenteUSF = response;

      },
      (error) => {
        console.log(error);
      }
    );
  }
  postUtenteUSF() {
    const utenteUSFData = {
      id_utente: this.UtenteUSF.id_utente, 
      id_USF: this.UtenteUSF.id_USF, 
    };
  
    this.http.post('http://localhost:3001/api/utenteUSF', utenteUSFData).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  closePopup() {
    this.showSuccessPopup = false;
  }
}
