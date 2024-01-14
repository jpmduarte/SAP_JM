import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-utente-dashboard',
  templateUrl: './utente-dashboard.component.html',
  styleUrls: ['./utente-dashboard.component.css'],
})
export class UtenteDashboardComponent {
  errorMessage = '';
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
    data_nascimento: Date,
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
    submissao_reavaliacao: false,
    dataSubmissaoReavaliacao: '',
    
  };
  UtenteUSF: any = {
    numero_utente: '',
    usf_name: '',
  };

  Current_numero_utente:string ='';
  isRejectedModalVisible: boolean = false;
  isAcceptedModalVisible: boolean = false;

  

  constructor(private router: Router, private http: HttpClient,private activatedRoute: ActivatedRoute,) {}
  

  ngOnInit(): void {
    this.fetchNumeroUtenteAndUtenteUSF();
    this.fetchIDutente();
    //this.fetchPedidos();
  }

  fetchNumeroUtenteAndUtenteUSF() {
    const email = this.activatedRoute.snapshot.queryParams['email'];
  
    this.http.get(`http://localhost:3001/api/numeroUtente?email=${email}`).subscribe(
      (response: any) => {
        this.Current_numero_utente = response.numero_utente;
        this.handleUserInfoFromRNUserver();
        this.fetchUtenteUSF(this.Current_numero_utente);
        
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fetchUtenteUSF(numero_utente: string) {
    console.log(numero_utente + " yo yo yo ");
  
    this.http.get(`http://localhost:3002/api/utenteusf?numero_utente=${numero_utente}`).subscribe(
      (response) => {
        console.log(response);
        this.UtenteUSF.usf_name = response;
        this.postUtenteUSF(response);
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
  
        this.primeiroPedido.idUtente = response.id_utente;
      
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleUserInfoFromRNUserver() {
    const numero_utente = this.Current_numero_utente

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
    this.closeModal();
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
    console.log('this is' + this.primeiroPedido);
    this.http.post('http://localhost:3001/api/pedidoAvaliacao', this.primeiroPedido).subscribe(
      (response :any) => {
        console.log(response);
      },
      (error) => {
        this.errorMessage = error.error.error;
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
  
 
  postUtenteUSF(usf_name: any) {
    const utenteUSFData = {
      numero_utente: this.Current_numero_utente, 
      usf_name: usf_name,
    };
    console.log(utenteUSFData.numero_utente + " " + utenteUSFData.usf_name);
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

  showModal() {
    this.isRejectedModalVisible = true;
    this.isAcceptedModalVisible = true;
  }

  closeModal() {
    this.isRejectedModalVisible = false;
    this.isAcceptedModalVisible = false;
  }
}