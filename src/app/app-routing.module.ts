// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { Activities } from './classes/activities';
// import {SignUpForCourseComponent} from './components/marketing/sign-up-for-course/sign-up-for-course.component';
// import { HomeComponent } from './components/marketing/home/home.component'
// import { DetilsContactComponent } from './components/marketing/detils-contact/detils-contact.component';
// import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
// import { AdminDashboardComponent } from './components/personal-area/admin/admin-dashboard/admin-dashboard.component';
// import { authGuard } from './guard/auth.guard';
// import { SecretaryDashboardComponent } from './components/personal-area/secretary/secretary-dashboard/secretary-dashboard.component';
// import { TherapistDashboardComponent } from './components/personal-area/therapist/therapist-dashboard/therapist-dashboard.component';
// import { PatientDashboardComponent } from './components/personal-area/patient/patient-dashboard/patient-dashboard.component';
// import { PatientListComponent } from './components/personal-area/therapist/patient-list/patient-list.component';

// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'SignUpForCourse', component: SignUpForCourseComponent },
//   { path: 'contact', component: DetilsContactComponent },
//   { path: 'secretary', component: SecretaryDashboardComponent },
//   { path: 'patient', component: PatientDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'patient' } },
//   { path: 'patientList', component: PatientListComponent, canActivate: [authGuard], data: { expectedRole: 'therapist' } },
//   { path: 'therapistDashboard', component: TherapistDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'therapist' } },
//   { path: 'secretary-dashboard', component: SecretaryDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'secretary' } },
//   { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'admin' } },
//   //{ path: 'patient/:id', component: PatientDashboardComponent },
//   //{ path: 'patientList', component: PatientListComponent },
//   //{ path: 'therapistDashboard', component: TherapistDashboardComponent },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {
//   activities: Activities[] = [
//     { activitiesId: 1, titleActivities: 'פעילות 1', urlImage: 'URL לתמונה', activitiesLink: 'לינק לפעילות 1' },
//     { activitiesId: 2, titleActivities: 'פעילות 2', urlImage: 'URL לתמונה', activitiesLink: 'לינק לפעילות 2' },
//   ];
//   scrollToTop() {
//     window.scrollTo(1000, window.innerHeight);
//   }
//  }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Activities } from './classes/activities';
import {SignUpForCourseComponent} from './components/marketing/sign-up-for-course/sign-up-for-course.component';
import { HomeComponent } from './components/marketing/home/home.component'
import { DetilsContactComponent } from './components/marketing/detils-contact/detils-contact.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { AdminDashboardComponent } from './components/personal-area/admin/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guard/auth.guard';
import { SecretaryDashboardComponent } from './components/personal-area/secretary/secretary-dashboard/secretary-dashboard.component';
import { TherapistDashboardComponent } from './components/personal-area/therapist/therapist-dashboard/therapist-dashboard.component';
import { PatientDashboardComponent } from './components/personal-area/patient/patient-dashboard/patient-dashboard.component';
import { PatientListComponent } from './components/personal-area/therapist/patient-list/patient-list.component';
import { TherapistsViewComponent } from './components/personal-area/secretary/therapists-view/therapists-view.component';
import { RoomsViewComponent } from './components/personal-area/secretary/rooms-view/rooms-view.component';
import { CompanyManagerDashboardComponent } from './components/personal-area/company-manager/company-manager-dashboard/company-manager-dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'company-manager', component: CompanyManagerDashboardComponent },
  { path: 'sign-up-for-course', component: SignUpForCourseComponent },
  { path: 'contact', component: DetilsContactComponent },

  
  
  { path: 'personal-area', children: [
    { path: 'therapist', component: TherapistDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'therapist' } },
    { path: 'patient', component: PatientDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'patient' } },
    { path: 'secretary', component: SecretaryDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'secretary' }, children: [
      { path: 'therapists', component: TherapistsViewComponent },
      { path: 'rooms', component: RoomsViewComponent }
    ] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard], data: { expectedRole: 'admin' } }
  ]},
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