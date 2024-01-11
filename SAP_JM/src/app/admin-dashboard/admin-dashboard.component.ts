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
  medicoName: string;
  email: string;
  password: string;
  accountType: number;
  numero_cedula: number;
}
interface Schedule {
  schedule: {
    id_medico: number;
    name: string;
    id: number;
    dia_semana: number;
    dia_semana_string: string;
    periodo_manha_inicio: string;
    periodo_manha_fim: string;
    periodo_tarde_inicio: string;
    periodo_tarde_fim: string;
    isdisponivel: boolean;
  };
}
interface medico {
  nomeprofissionalsaude: string;
  numero_cedula: Number;
  id_profissionalsaude: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  users: User[] = [];
  schedules: Schedule[] = [];
  showUsersTable = false;
  showSchedulesTable = false;
  selectedUser: User | undefined;
  selectedUserToUpdate: User | undefined;
  employeeData: Employee = { psaudeName: '', email: '', password: '', accountType: 2, numero_cedula: 0 };
  ScheduleTimes: string[] = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  users: User[] = [];
  selectedUser: User | undefined;
  daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  doctorsWithNoSchedule: medico[] = [];
  doctorswithSchedules: medico[] = [];
  showCreateEmployeeForm = false;
  ScheduleTimes: string[] = [
    '7:00',
    '7:30',
    '8:00 ',
    '8:30',
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
  ];
  showAlterScheduleform = false;
  isAvail: boolean = false;
  showCreateForm = false;
  selectedpsaude: any; // Replace with your specific doctor type
  selectedDayOfWeek!: number;
  selectedMorningStart: string = '';
  selectedMorningEnd: string = '';
  selectedAfternoonStart: string = '';
  selectedAfternoonEnd: string = '';
  selectedUpdatepsaude: any;
  errorMessage: string | undefined;
  employeeData: Employee = {
    medicoName: '',
    email: '',
    password: '',
    accountType: 0,
  };
  showLogoutPopup = false;

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

  submitUpdateForm() {
    if (this.selectedUserToUpdate) {
      const userId = this.selectedUserToUpdate.id_user;
      const { nome, nomeperfil, email, password } = this.selectedUserToUpdate;

      const body = {
        nome: nome,
        nomeperfil: nomeperfil,
        email: email,
        password: password,
      };

      // this.http.put(`/api/updateusers/${userId}`, body).subscribe(
      //   () => {
      //     console.log('User updated successfully');
      //   },
      //   (error: any) => {
      //     console.error('Error updating user:', error);
      //   }
      // );
    }
  }

  cancelUpdate() {
    this.selectedUserToUpdate = undefined;
  }

}
