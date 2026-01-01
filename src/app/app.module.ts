import { CalendarOverlayComponent } from './components/personal-area/patient/calendar-overlay.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';

import { AuthInterceptor } from './services/auth.interceptor'; 

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

import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { PatientListComponent } from './components/personal-area/patient/patient-list/patient-list.component';
import { PatientNameFilterPipe } from './components/personal-area/patient/patient-list/patient-name-filter.pipe';
import { TherapistCalendarComponent } from './components/personal-area/therapist/therapist-calendar/therapist-calendar.component'
import { TherapistDashboardComponent } from './components/personal-area/therapist/therapist-dashboard/therapist-dashboard.component';
import { TreatmentListComponent } from './components/personal-area/patient/treatment-list/treatment-list.component';
import { AddPatientDialogComponent } from './components/personal-area/patient/add-patient-dialog/add-patient-dialog.component';
import { CreateTreatmentDialogComponent } from './components/personal-area/patient/add-treatment-dialog/add-treatment-dialog.component';
import { RoomCalendarComponent } from './components/personal-area/company-manager/rooms/room-calendar/room-calendar.component';
import { SelectTimeDialogComponent } from './components/select-time-dialog/select-time-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TreatmentSummaryComponent } from './components/personal-area/patient/treatment-summary/treatment-summary.component';
import { PatientDetailsComponent } from './components/personal-area/patient/patient-details/patient-details.component';
import { TherapistListComponent } from './components/personal-area/therapist/therapist-list/therapist-list.component';
import { AddTherapistDialogComponent } from './components/personal-area/therapist/add-therapist-dialog/add-therapist-dialog.component';
import { SecretaryHeaderComponent } from './components/personal-area/secretary/secretary-header/secretary-header.component';
import { TherapistHeaderComponent } from './components/personal-area/therapist/therapist-header/therapist-header.component';
import { RoomsViewComponent } from './components/personal-area/company-manager/rooms/rooms-view/rooms-view.component';
import { RoomListCalendarComponent } from './components/personal-area/company-manager/rooms/room-list-calendar/room-list-calendar.component';
import { TherapistsViewComponent } from './components/personal-area/therapist/therapists-view/therapists-view.component';
import { CompanyManagerHeaderComponent } from './components/personal-area/company-manager/company-manager-header/company-manager-header.component';
import { CompanyManagerDashboardComponent } from './components/personal-area/company-manager/company-manager-dashboard/company-manager-dashboard.component';
import { SecretaryListComponent } from './components/personal-area/company-manager/secretary-list/secretary-list.component';
import { DepartmentsGroupsListComponent } from './components/personal-area/company-manager/departments/departments-groups-list/departments-groups-list.component';
import { DepartmentDetailsComponent } from './components/personal-area/company-manager/departments/department-details/department-details.component';
import { DepartmentsGroupViewComponent } from './components/personal-area/company-manager/departments/departments-groups-view/departments-groups-view.component';
import { AddDepartmentDialogComponent } from './components/personal-area/company-manager/departments/add-department-dialog/add-department-dialog.component';
import { PatientTableComponent } from './components/personal-area/patient/patient-table/patient-table.component';
import { AddGroupDialogComponent } from './components/personal-area/company-manager/departments/add-group-dialog/add-group-dialog.component';
import { DepartmentGroupSelectorComponent } from './components/personal-area/company-manager/departments/department-group-selector/department-group-selector.component';
import { SecretaryHomeComponent } from './components/personal-area/secretary/secretary-home/secretary-home.component';
import { PatientViewComponent } from './components/personal-area/patient/patient-view/patient-view.component';
import { AddProspectDialogComponent } from './components/personal-area/company-manager/prospects/add-prospect-dialog/add-prospect-dialog.component';
import { ProspectViewComponent } from './components/personal-area/company-manager/prospects/prospect-view/prospect-view.component';
import { ProspectTableComponent } from './components/personal-area/company-manager/prospects/prospect-table/prospect-table.component';
import { CategoryListComponent } from './components/personal-area/company-manager/category/category-list/category-list.component';
import { AddCategoryDialogComponent } from './components/personal-area/company-manager/category/add-category-dialog/add-category-dialog.component';
import { CategorySelectorComponent } from './components/personal-area/company-manager/category/category-selector/category-selector.component';
import { ProspectDetailsComponent } from './components/personal-area/company-manager/prospects/prospect-details/prospect-details.component';
import { GroupTherapistsComponent } from './components/personal-area/company-manager/departments/group-therapists/group-therapists.component';
import { TherapistTableComponent } from './components/personal-area/therapist/therapist-table/therapist-table.component';
import { PaymentListComponent } from './components/personal-area/company-manager/payment/payment-list/payment-list.component';
import { AddTransactionComponent } from './components/personal-area/company-manager/payment/add-transaction/add-transaction.component';
import { FollowupTableComponent } from './components/personal-area/company-manager/followup/followup-table/followup-table.component';
import { AddFollowupDialogComponent } from './components/personal-area/company-manager/followup/add-followup-dialog/add-followup-dialog.component';
import { UserFollowUpTableComponent } from './components/personal-area/company-manager/followup/user-follow-up-table/user-follow-up-table.component';
import { AddRoomDialogComponent } from './components/personal-area/company-manager/rooms/add-room-dialog/add-room-dialog.component';
import { RoomSettingsComponent } from './components/personal-area/company-manager/rooms/room-settings/room-settings.component';
import { RoomsHomeComponent } from './components/personal-area/company-manager/rooms/rooms-home/rooms-home.component';
import { TextEditorComponent } from './components/personal-area/company-manager/text-editor/text-editor.component';
import { ContactListComponent } from './components/personal-area/patient/PatientContacts/contact-list/contact-list.component';
import { AddContactDialogComponent } from './components/personal-area/patient/PatientContacts/add-contact-dialog/add-contact-dialog.component';
import { TherapistHomeComponent } from './components/personal-area/therapist/therapist-home/therapist-home.component';
import { TherapistReportsComponent } from './components/personal-area/therapist/therapist-reports/therapist-reports.component';
import { ReportsListComponent } from './components/personal-area/company-manager/reports/reports-list/reports-list.component';
import { ReportsViewComponent } from './components/personal-area/company-manager/reports/reports-view/reports-view.component';
import { AddReportsComponent } from './components/personal-area/company-manager/reports/add-reports/add-reports.component';
import { ReportDetailsComponent } from './components/personal-area/company-manager/reports/report-details/report-details.component';
import { IncomeReportComponent } from './components/personal-area/company-manager/reports/income-report/income-report.component';


@NgModule({
  declarations: [
    SecretaryHomeComponent,
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
  PatientNameFilterPipe,
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
    SelectTimeDialogComponent,
    CalendarOverlayComponent,
    RoomsViewComponent,
    TherapistsViewComponent,
    CompanyManagerHeaderComponent,
    CompanyManagerDashboardComponent,
    SecretaryListComponent,
    DepartmentsGroupsListComponent,
    DepartmentDetailsComponent,
    DepartmentsGroupViewComponent,
    AddDepartmentDialogComponent,
    PatientTableComponent,
    AddGroupDialogComponent,
    DepartmentGroupSelectorComponent,
    PatientViewComponent,
    AddProspectDialogComponent,
    ProspectViewComponent,
    ProspectTableComponent,
    CategoryListComponent,
    AddCategoryDialogComponent,
    RoomListCalendarComponent,
    CategorySelectorComponent,
    ProspectDetailsComponent,
    GroupTherapistsComponent,
    TherapistTableComponent,
    PaymentListComponent,
    AddTransactionComponent,
    FollowupTableComponent,
    AddFollowupDialogComponent,
    UserFollowUpTableComponent,
    AddRoomDialogComponent,
    RoomSettingsComponent,
    RoomsHomeComponent,
  TextEditorComponent,
  ContactListComponent,
  AddContactDialogComponent,
  TherapistHomeComponent,
  TherapistReportsComponent,
  ReportsListComponent,
  ReportsViewComponent,
  AddReportsComponent,
  ReportDetailsComponent,
  IncomeReportComponent,
  ],
  imports: [
    QuillModule.forRoot(),
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
    BrowserModule,
    MatTooltipModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, 
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
    MatCardModule, 
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FullCalendarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }