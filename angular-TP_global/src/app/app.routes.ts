import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MedicoDashboardComponent } from './medico-dashboard/medico-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UtenteDashboardComponent } from './utente-dashboard/utente-dashboard.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'medico_dashboard', component: MedicoDashboardComponent },
    { path: 'admin_dashboard', component: AdminDashboardComponent },
    { path: 'utente_dashboard', component: UtenteDashboardComponent },
    { path: 'login', component: LoginComponent }
];
