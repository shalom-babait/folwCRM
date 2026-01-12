import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/personal-area/admin/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guard/auth.guard';
import { SecretaryDashboardComponent } from './components/personal-area/secretary/secretary-dashboard/secretary-dashboard.component';
import { TherapistDashboardComponent } from './components/personal-area/therapist/therapist-dashboard/therapist-dashboard.component';
import { PatientDashboardComponent } from './components/personal-area/patient/patient-dashboard/patient-dashboard.component';
import { CompanyManagerDashboardComponent } from './components/personal-area/company-manager/company-manager-dashboard/company-manager-dashboard.component';
import { SecretaryHomeComponent } from './components/personal-area/secretary/secretary-home/secretary-home.component';
import { LogInComponent } from './components/log-in/log-in.component';

const routes: Routes = [
  { path: '', component: LogInComponent },
  {path: 'company-manager', component: CompanyManagerDashboardComponent,canActivate: [authGuard], data: { expectedRole: 'company_manager' },},
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'admin' } },
  {
    path: 'personal-area', children: [
      {
        path: 'therapist', component: TherapistDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'therapist' }, children: [
        ]
      },
      { path: 'patient', component: PatientDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'patient' } },

      {
        path: 'secretary', component: SecretaryDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'secretary' }, children: [
          { path: '', component: SecretaryHomeComponent },
        ]
      },
      { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'admin' } }
    ]

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}