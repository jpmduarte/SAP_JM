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

  UsfAssociada = {
    id_utente: '',
    nomeUSF: '',
  };

  UserInfo = {
    nomeCompleto: '',
    numeroUtente: '',
    dataNascimento: '',
    nIdentificacao: '',
    nif: '',
    DataDeValidade: '',
    rua: '',
    codigoPostal: '',
    localidade: '',
    concelho: '',
    distrito: '',
    telemovel: '',
    email: '',
  };

  constructor(private router: Router, private http: HttpClient,private activatedRoute: ActivatedRoute,) {}
  
  handleUserInfoFromRNUserver() {
    // Retrieve the email from the URL
    const email = this.activatedRoute.snapshot.queryParams['email'];
    console.log(email);
  
    // Check if the email parameter is present
    if (!email) {
      console.error('Email parameter is missing in the URL');
      return;
    }
  
    // Include the email parameter in the URL
    const url = `http://localhost:3002/api/userinfo?email=${email}`;
  
    // Make the HTTP request with the updated URL
    this.http.get(url).subscribe(
      (response: any) => {
        console.log(response);
        this.UserInfo.nomeCompleto = response.nomeCompleto;
        this.UserInfo.numeroUtente = response.numeroUtente;
        this.UserInfo.dataNascimento = response.dataNascimento;
        this.UserInfo.nIdentificacao = response.nIdentificacao;
        this.UserInfo.nif = response.nif;
        this.UserInfo.DataDeValidade = response.DataDeValidade;
        this.UserInfo.rua = response.rua;
        this.UserInfo.codigoPostal = response.codigoPostal;
        this.UserInfo.localidade = response.localidade;
        this.UserInfo.concelho = response.concelho;
        this.UserInfo.distrito = response.distrito;
        this.UserInfo.telemovel = response.telemovel;
        this.UserInfo.email = response.email;
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
  }

  closePopup() {
    this.showSuccessPopup = false;
  }
}
