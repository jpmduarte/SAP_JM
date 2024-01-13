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
  nome_medico: string;
  email: string;
  password: string;
  numero_cedula: number;
}
interface medico {
  nome: string;
  numero_cedula: Number;
  id_medico: number;
}
interface Schedule {
  schedule: {
    id_medico: number;
    nome: string;
    id: number;
    dia_semana: string;
    periodo_manha_inicio: string;
    periodo_manha_fim: string;
    periodo_tarde_inicio: string;
    periodo_tarde_fim: string;
  };
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  errorMessage = '';
  showLogoutPopup = false;
  showUsersTable = false;
  showSchedulesTable = false;
  showCreateEmployeeForm = false;
  selectedUserToUpdate: User | undefined;
  employeeData: Employee = { nome_medico: '', email: '', password: '', numero_cedula: 0 };
  ScheduleTimes: string[] = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  users: User[] = [];
  selectedUser: User | undefined;
  doctorsWithNoSchedule: medico[] = [];
  doctorswithSchedules: medico[] = [];
  selectedUpdatepsaude: any;
  selectedpsaude: any;
  showCreateForm = false;
  selectedDayOfWeek!: number;
  selectedMorningStart: string = '';
  selectedMorningEnd: string = '';
  selectedAfternoonStart: string = '';
  selectedAfternoonEnd: string = '';
  showAlterScheduleform = false;
  schedules: Schedule[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.showUsersTable = true;
    this.loadUSF();
    this.fetchDoctorsWithNoSchedule();
    this.fetchSchedules();
    this.fetchAllDoctorsWithSchedule();
  }

  loadUSF() {
    this.http.get('http://localhost:3001/api/loadusf').subscribe(
      (response: any) => {
        if (response.success) {
          console.log('USF:', response.usf);
        } else {
          console.log('Error:', response.erro);
        }
      },
      (error: any) => {
        console.log('Error:', error);
      }
    );
  }

  fetchUsers() {
    this.http.get<User[]>('http://localhost:3001/api/users').subscribe(
      (response: any) => {
        if (response.success) {
          this.users = response.users;  // Update the users array
          console.log('Users:', this.users);
        } else {
          console.log('Error:', response.erro);
        }
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

  deleteUser(user: User): void {
    const userId = user.id_user;
    this.http.put(`/api/deactivateusers/${userId}`, {}).subscribe(
      () => {
        console.log('User deleted successfully');
        this.fetchUsers();
      },
      (error: any) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  submitCreateEmployeeForm()
  {
    this.http.post('http://localhost:3001/api/createemployee', this.employeeData).subscribe(
      () => {
        console.log('Employee created successfully');
        
        this.fetchUsers();
        this.errorMessage = 'Utilizador criado com sucesso!';
        this.showCreateEmployeeForm = false;
        this.showUsersTable = true;
      },
      (error: any) => {
        console.error('Error creating employee:', error);
        this.errorMessage = error.error.error;
      }
    );
  }

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
      this.http.put(`/api/updateusers/${userId}`, body).subscribe(
        () => {
          console.log('User updated successfully');
        },
        (error: any) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  createschedule(doctor: medico) {
    this.selectedpsaude = doctor;
    this.showCreateForm = true;
  }

  submitCreateScheduleForm() {
    const body = {
      id_profissionalsaude: this.selectedpsaude.id_medico,
      dia_semana: this.selectedDayOfWeek,
      periodo_manha_inicio: this.selectedMorningStart,
      periodo_manha_fim: this.selectedMorningEnd,
      periodo_tarde_inicio: this.selectedAfternoonStart,
      periodo_tarde_fim: this.selectedAfternoonEnd,
    };
    console.log(body);
    this.http.post('http://localhost:3001/api/createschedule', body).subscribe(
      () => {
        console.log('Schedule created successfully');
      },
      (error: any) => {
        console.error('Error creating schedule:', error);
      }
    );
    this.showCreateForm = false;
  }

  cancelCreateSchedule() {
    this.selectedDayOfWeek;
    this.selectedMorningStart = '';
    this.selectedMorningEnd = '';
    this.selectedAfternoonEnd = '';
    this.selectedAfternoonStart = '';
    this.showCreateForm = false;
  }

  alterschedule(doctor: medico) {
    this.selectedUpdatepsaude = doctor;
    this.showAlterScheduleform = true;
  }

  submitAlterScheduleForm() {
    const body = {
      id_medico: this.selectedUpdatepsaude.id_medico,
      dia_semana: this.selectedDayOfWeek,
      periodo_manha_inicio: this.selectedMorningStart,
      periodo_manha_fim: this.selectedMorningEnd,
      periodo_tarde_inicio: this.selectedAfternoonStart,
      periodo_tarde_fim: this.selectedAfternoonEnd,
    };

    console.log(body);

    this.http.put('/api/alterschedule', body).subscribe(
      () => {
        console.log('Schedule updated successfully');
      },
      (error: any) => {
        console.error('Error updating schedule:', error);
      }
    );

    this.showAlterScheduleform = false;
  }

  cancelAlterSchedule() {
    this.showAlterScheduleform = false;
  }

  cancelUpdate() {
    this.selectedUserToUpdate = undefined;
  }

  fetchSchedules() {
    this.http.get<Schedule[]>('http://localhost:3001/api/schedules').subscribe(
      (response: Schedule[]) => {
        console.log('Schedules:', response);
        this.schedules = response;
      },
      (error: any) => {
        console.log('Error fetching schedules:', error);
      }
    );
  }
  
  fetchDoctorsWithNoSchedule() {
    this.http.get<medico[]>('http://localhost:3001/api/noSchedule').subscribe(
      (response: medico[]) => {
        this.doctorsWithNoSchedule = response;
        console.log(response);
      },
      (error: any) => {
        console.log('Error fetching doctors without a full schedule:', error);
      }
    );
  }

   fetchAllDoctorsWithSchedule() {
     this.http.get<medico[]>('http://localhost:3001/api/fetchdoctorswithschedule').subscribe(
     (response: medico[]) => {
         this.doctorswithSchedules = response;
         console.log(response);
      },
       (error: any) => {
        console.log('Error fetching doctors with schedule:', error);
       }
    );
 }
}

