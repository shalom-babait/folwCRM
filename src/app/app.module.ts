import { CalendarOverlayComponent } from './components/personal-area/patient/calendar-overlay.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // הוספת ReactiveFormsModule
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor'; // ודאי שהקובץ נמצא בנתיב הזה

import { AppComponent } from './app.component';
import { HeaderComponent } from "./components/marketing/header/header.component";
import { AdvertisingComponent } from "./components/marketing/advertising/advertising.component";
import { AboutComponent } from "./components/marketing/about/about.component";
import { DonateButtonComponent } from "./components/marketing/donate-button/donate-button.component";

import { FooterComponent } from "./components/marketing/footer/footer.component";
import { ListOfActivitiesComponent } from './components/marketing/list-of-activities/list-of-activities.component';
import { WeNumbersComponent } from "./components/marketing/we-numbers/we-numbers.component";
import { ContactComponent } from "./components/marketing/contact/contact.component";
import { TheySayAboutUsComponent } from './components/marketing/they-say-about-us/they-say-about-us.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card'; // הוספת MatCardModule
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

import { SignUpForCourseComponent } from './components/marketing/sign-up-for-course/sign-up-for-course.component';
import { HomeComponent } from './components/marketing/home/home.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LogInComponent } from './components/marketing/log-in/log-in.component';
import { ConsultationMeetingComponent } from './components/consultation-meeting/consultation-meeting.component';
import { AdminDashboardComponent } from './components/personal-area/admin/admin-dashboard/admin-dashboard.component';
import { SecretaryDashboardComponent } from './components/personal-area/secretary/secretary-dashboard/secretary-dashboard.component';
import { PatientDashboardComponent } from './components/personal-area/patient/patient-dashboard/patient-dashboard.component';
import { LinkContentComponent } from './components/marketing/link-content/link-content.component';
import { PatientListComponent } from './components/personal-area/therapist/patient-list/patient-list.component';
import { TherapistCalendarComponent } from './components/personal-area/therapist/therapist-calendar/therapist-calendar.component'
import { TherapistDashboardComponent } from './components/personal-area/therapist/therapist-dashboard/therapist-dashboard.component';
import { TreatmentListComponent } from './components/personal-area/patient/treatment-list/treatment-list.component';
import { AddPatientDialogComponent } from './components/personal-area/patient/add-patient-dialog/add-patient-dialog.component';
import { CreateTreatmentDialogComponent } from './components/personal-area/patient/add-treatment-dialog/add-treatment-dialog.component';
import { RoomCalendarComponent } from './components/room-calendar/room-calendar.component';
import { RoomListCalendarComponent } from './components/room-list-calendar/room-list-calendar.component';
import { SelectTimeDialogComponent } from './components/select-time-dialog/select-time-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TreatmentSummaryComponent } from './components/personal-area/patient/treatment-summary/treatment-summary.component';
import { PatientDetailsComponent } from './components/personal-area/patient/patient-details/patient-details.component';
import { TherapistListComponent } from './components/personal-area/secretary/therapist-list/therapist-list.component';
import { AddTherapistDialogComponent } from './components/personal-area/secretary/add-therapist-dialog/add-therapist-dialog.component';
import { SecretaryHeaderComponent } from './components/personal-area/secretary/secretary-header/secretary-header.component';
import { TherapistHeaderComponent } from './components/personal-area/therapist/therapist-header/therapist-header.component';
import { RoomsViewComponent } from './components/personal-area/secretary/rooms-view/rooms-view.component';
import { TherapistsViewComponent } from './components/personal-area/secretary/therapists-view/therapists-view.component';
import { CompanyManagerHeaderComponent } from './components/personal-area/company-manager/company-manager-header/company-manager-header.component';
import { CompanyManagerDashboardComponent } from './components/personal-area/company-manager/company-manager-dashboard/company-manager-dashboard.component';
import { SecretaryListComponent } from './components/personal-area/company-manager/secretary-list/secretary-list.component';
import { DepartmentsListComponent } from './components/personal-area/company-manager/departments/departments-list/departments-list.component';
import { DepartmentDetailsComponent } from './components/personal-area/company-manager/departments/department-details/department-details.component';
import { DepartmentsViewComponent } from './components/personal-area/company-manager/departments/departments-view/departments-view.component';
import { AddDepartmentDialogComponent } from './components/personal-area/company-manager/departments/add-department-dialog/add-department-dialog.component';
import { PatientTableComponent } from './components/personal-area/patient/patient-table/patient-table.component';
import { AddGroupDialogComponent } from './components/personal-area/company-manager/departments/add-group-dialog/add-group-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AdvertisingComponent,
    AboutComponent,
    DonateButtonComponent,
    FooterComponent,
    ListOfActivitiesComponent,
    WeNumbersComponent,
    ContactComponent,
    TheySayAboutUsComponent,
    SignUpForCourseComponent,
    PatientListComponent,
    HomeComponent,
    RegistrationFormComponent,
    LogInComponent,
    ConsultationMeetingComponent,
    AdminDashboardComponent,
    SecretaryDashboardComponent,
    TherapistCalendarComponent,
    PatientDashboardComponent,
    TherapistDashboardComponent,
    LinkContentComponent,
    TreatmentListComponent,
    AddPatientDialogComponent,
    CreateTreatmentDialogComponent,
    TreatmentSummaryComponent,
    PatientDetailsComponent,
    TherapistListComponent,
    AddTherapistDialogComponent,
    SecretaryHeaderComponent,
    TherapistHeaderComponent,
  RoomCalendarComponent,
  RoomListCalendarComponent,
  SelectTimeDialogComponent,
  CalendarOverlayComponent,
    RoomsViewComponent,
    TherapistsViewComponent,
    CompanyManagerHeaderComponent,
    CompanyManagerDashboardComponent,
    SecretaryListComponent,
    DepartmentsListComponent,
    DepartmentDetailsComponent,
    DepartmentsViewComponent,
    AddDepartmentDialogComponent,
    PatientTableComponent,
    AddGroupDialogComponent,
  ],
  imports: [
    MatMenuModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, // הוספת ReactiveFormsModule
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatGridListModule,
    MatToolbarModule,
    MatListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule, // הוספת MatCardModule
    MatProgressSpinnerModule,
  MatSnackBarModule,
  FullCalendarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }