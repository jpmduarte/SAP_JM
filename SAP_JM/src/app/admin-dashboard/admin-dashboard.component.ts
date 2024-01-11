import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface User {
  id_user: number;
  nome: string;
  email: string;
  nomeperfil: string;
  password: string;
}
interface Employee {
  psaudeName: string;
  email: string;
  password: string;
  accountType: number;
  numero_cedula: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  showLogoutPopup = false;
  showUsersTable = false;
  showSchedulesTable = false;
  showCreateEmployeeForm = false;
  selectedUserToUpdate: User | undefined;
  employeeData: Employee = { psaudeName: '', email: '', password: '', accountType: 2, numero_cedula: 0 };
  ScheduleTimes: string[] = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  users: User[] = [];
  selectedUser: User | undefined;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.showUsersTable = true;
  }



  fetchUsers() {
    this.http.get<User[]>('/api/users').subscribe(
      (response: User[]) => {
        this.users = response;
        console.log('API response:', response);
      },
      (error: any) => {
        console.log('Error:', error);
      }
    );
    
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  logout(): void {
    this.showLogoutPopup = false;
    this.router.navigate(['/login']);
  }

  showUsers() {
    this.showUsersTable = true;
    this.showSchedulesTable = false;
    this.showCreateEmployeeForm = false;
  }

  addEmployee() {
    this.showUsersTable = false;
    this.showSchedulesTable = false;
    this.showCreateEmployeeForm = true;
  }

  showSchedules() {
    this.showUsersTable = false;
    this.showSchedulesTable = true;
    this.showCreateEmployeeForm = false;
  }


  confirmDelete(user: User) {
    this.selectedUser = user;
  }

  cancelDelete(): void {
    this.selectedUser = undefined;
  }

  // deleteUser(user: User): void {
  //   const userId = user.id_user;
  //   this.http.put(`/api/deactivateusers/${userId}`, {}).subscribe(
  //     () => {
  //       console.log('User deleted successfully');
  //       this.fetchUsers();
  //     },
  //     (error: any) => {
  //       console.error('Error deleting user:', error);
  //     }
  //   );
  // }

  // submitCreateEmployeeForm(employee: any) {
  //     employee.accountType = Number(employee.accountType) + 1;
  //     console.log('Employee data:', employee);
  
  //     this.http.post('/api/register', employee).subscribe(
  //       () => {
  //         console.log('User created successfully');
  //         employee.accountType = Number(employee.accountType) - 1;
  //         this.http.post('/api/registerPsaude', employee).subscribe(
  //           () => {
  //             console.log('Healthcare professional created successfully');
  //             this.showCreateEmployeeForm = false;
  //           },
  //           (error: any) => {
  //             console.error('Error creating healthcare professional:', error);
  //             this.errorMessage = error.error.error || 'An unknown error occurred';
  //             this.showCreateEmployeeForm = false;
  //           }
  //         );
  //       },
  //       (error: any) => {
  //         console.error('Error creating user:', error);
  //       }
  //     );
  // }

  updateUser(user: User) {
    this.selectedUserToUpdate = user;
  }

  // submitUpdateForm() {
  //   if (this.selectedUserToUpdate) {
  //     const userId = this.selectedUserToUpdate.id_user;
  //     const { nome, nomeperfil, email, password } = this.selectedUserToUpdate;

  //     const body = {
  //       nome: nome,
  //       nomeperfil: nomeperfil,
  //       email: email,
  //       password: password,
  //     };

  //     this.http.put(`/api/updateusers/${userId}`, body).subscribe(
  //       () => {
  //         console.log('User updated successfully');
  //       },
  //       (error: any) => {
  //         console.error('Error updating user:', error);
  //       }
  //     );
  //   }
  // }

  cancelUpdate() {
    this.selectedUserToUpdate = undefined;
  }

}
