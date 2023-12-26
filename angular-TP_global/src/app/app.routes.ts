import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UtenteDashboardComponent } from './utente-dashboard/utente-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'utente_dashboard', component : UtenteDashboardComponent},
    { path: 'admin_dashboard', component : AdminDashboardComponent},
];

