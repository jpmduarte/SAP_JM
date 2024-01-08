import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  success: boolean;
  perfil: number; 
  erro: string;
}

interface RegisterResponse {
  success: boolean;
  erro: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})



export class LoginComponent {

  errorMessage = '';
  successMessage = '';
  registerInfo = {
    email: '',
    password: '',
    nome: '',
    numeroUtente: '',
  };
  loginInfo = {
    email: '',
    password: ''
  };

  showLoginForm = true;

  constructor(private router: Router, private http: HttpClient) { }


  toggleForm(event: Event): void {
    event.preventDefault();
    this.showLoginForm = !this.showLoginForm;
  }

  handleRegister() {
      this.http.post<RegisterResponse>('http://localhost:3001/api/register', this.registerInfo).subscribe(
        (response) => {
          console.log(response);
          if (response.success == true) {
            this.successMessage = 'Registration successful. You can now login.';
            setTimeout(() => {
            this.router.navigate(['/login']);
            },50);
          } else if (response.success === false)
          {
            this.errorMessage = response.erro;
            console.log(response.erro);
          }
        },
        (error) => {
          this.errorMessage = 'An error occurred during registration. Please try again.';
          console.error(error);
        }
      );
  }

  handleLogin() {
    this.http.post<LoginResponse>('http://localhost:3001/api/login', this.loginInfo).subscribe(
      (response) => {
        console.log(response);
        if (response.success == true) {
          if (response.perfil == 1) {
            this.router.navigate(['/admin_dashboard']);
          } else if (response.perfil == 2) {
            this.router.navigate(['/utente_dashboard']);
          } else if (response.perfil == 3) {
            this.router.navigate(['/medico_dashboard']);
          }
        } else if (response.success === false)
        {
          this.errorMessage = response.erro;
          console.log(response.erro);
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred during login. Please try again.';
        console.error(error);
      }
    );
    console.log(this.loginInfo);
  }
  
}
