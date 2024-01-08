// File: app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../../SAP_JM/src/app/login/login.component';
import { MedicoDashboardComponent } from '../../../SAP_JM/src/app/medico-dashboard/medico-dashboard.component';
import { AdminDashboardComponent } from '../../../SAP_JM/src/app/admin-dashboard/admin-dashboard.component';
import { UtenteDashboardComponent } from '../../../SAP_JM/src/app/utente-dashboard/utente-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'medico_dashboard', component: MedicoDashboardComponent },
  { path: 'admin_dashboard', component: AdminDashboardComponent },
  { path: 'utente_dashboard', component: UtenteDashboardComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
