import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Activities } from './classes/activities';
import { SignUpForCourseComponent } from './components/marketing/sign-up-for-course/sign-up-for-course.component';
import { HomeComponent } from './components/marketing/home/home.component'
import { DetilsContactComponent } from './components/marketing/detils-contact/detils-contact.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { AdminDashboardComponent } from './components/personal-area/admin/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guard/auth.guard';
import { SecretaryDashboardComponent } from './components/personal-area/secretary/secretary-dashboard/secretary-dashboard.component';
import { TherapistDashboardComponent } from './components/personal-area/therapist/therapist-dashboard/therapist-dashboard.component';
import { PatientDashboardComponent } from './components/personal-area/patient/patient-dashboard/patient-dashboard.component';
import { PatientListComponent } from './components/personal-area/patient/patient-list/patient-list.component';
import { TherapistsViewComponent } from './components/personal-area/therapist/therapists-view/therapists-view.component';
import { RoomsViewComponent } from './components/personal-area/company-manager/rooms/rooms-view/rooms-view.component';
import { CompanyManagerDashboardComponent } from './components/personal-area/company-manager/company-manager-dashboard/company-manager-dashboard.component';
import { DepartmentsGroupViewComponent } from './components/personal-area/company-manager/departments/departments-groups-view/departments-groups-view.component';
import { SecretaryHomeComponent } from './components/personal-area/secretary/secretary-home/secretary-home.component';
import { PatientViewComponent } from './components/personal-area/patient/patient-view/patient-view.component';
import { TherapistCalendarComponent } from './components/personal-area/therapist/therapist-calendar/therapist-calendar.component';
import { LogInComponent } from './components/marketing/log-in/log-in.component';

const routes: Routes = [
  { path: '', component: LogInComponent },
  {
    path: 'company-manager', component: CompanyManagerDashboardComponent, children: [
      { path: 'departments', component: DepartmentsGroupViewComponent }
    ]
  },
  { path: 'sign-up-for-course', component: SignUpForCourseComponent },
  { path: 'contact', component: DetilsContactComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'admin' } },
  // { path: 'patient/:id', component: PatientDashboardComponent },
  { path: 'patientList', component: PatientListComponent },

  {
    path: 'personal-area', children: [
      {
        path: 'therapist', component: TherapistDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'therapist' }, children: [
          { path: 'patient', component: PatientViewComponent },
          { path: 'calendar', component: TherapistCalendarComponent }
        ]
      },
      { path: 'patient', component: PatientDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'patient' } },

      {
        path: 'secretary', component: SecretaryDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'secretary' }, children: [
          { path: '', component: SecretaryHomeComponent },
          { path: 'rooms', component: RoomsViewComponent },
          { path: 'therapists', component: TherapistsViewComponent },
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
export class AppRoutingModule {
  activities: Activities[] = [
    { activitiesId: 1, titleActivities: 'פעילות 1', urlImage: 'URL לתמונה', activitiesLink: 'לינק לפעילות 1' },
    { activitiesId: 2, titleActivities: 'פעילות 2', urlImage: 'URL לתמונה', activitiesLink: 'לינק לפעילות 2' },
  ];
  scrollToTop() {
    window.scrollTo(1000, window.innerHeight);
  }
}