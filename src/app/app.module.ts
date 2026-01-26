import { CalendarOverlayComponent } from './components/personal-area/company-manager/calendars/calendar-overlay/calendar-overlay.component';
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
import { NgChartsModule } from 'ng2-charts';

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

import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { AdminDashboardComponent } from './components/personal-area/admin/admin-dashboard/admin-dashboard.component';
import { SecretaryDashboardComponent } from './components/personal-area/secretary/secretary-dashboard/secretary-dashboard.component';
import { PatientDashboardComponent } from './components/personal-area/patient/patient-dashboard/patient-dashboard.component';
import { PatientListComponent } from './components/personal-area/patient/patient-list/patient-list.component';
import { PatientNameFilterPipe } from './components/personal-area/patient/patient-list/patient-name-filter.pipe';
import { TherapistCalendarComponent } from './components/personal-area/therapist/therapist-calendar/therapist-calendar.component'
import { TherapistDashboardComponent } from './components/personal-area/therapist/therapist-dashboard/therapist-dashboard.component';
import { AppointmentListComponent } from './components/personal-area/patient/appointment-list/appointment-list.component';
import { AddPatientDialogComponent } from './components/personal-area/patient/add-patient-dialog/add-patient-dialog.component';
import { AddAppointmentDialogComponent } from './components/personal-area/patient/add-appointment-dialog/add-appointment-dialog.component';
import { DisplayCalendarComponent } from './components/personal-area/company-manager/calendars/display-calendar/display-calendar.component';
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
import { UserSettingsComponent } from './components/personal-area/company-manager/user-settings/user-settings.component';
import { AddPatientProblemComponent } from './components/personal-area/patient/PatientProblem/add-patient-problem/add-patient-problem.component';
import { PatientProblemTableComponent } from './components/personal-area/patient/PatientProblem/patient-problem-table/patient-problem-table.component';
import { AddPatientProblemRatingComponent } from './components/personal-area/patient/PatientProblem/add-patient-problem-rating/add-patient-problem-rating.component';
import { PatientProblemRatingListComponent } from './components/personal-area/patient/PatientProblem/patient-problem-rating-list/patient-problem-rating-list.component';
import { TherapistSettingsMenuComponent } from './components/personal-area/therapist/settings/therapist-settings-menu/therapist-settings-menu.component';
import { TherapistSettingsViewComponent } from './components/personal-area/therapist/settings/therapist-settings-view/therapist-settings-view.component';
import { AddTaskComponent } from './components/personal-area/company-manager/task/add-task/add-task.component';
import { TaskListComponent } from './components/personal-area/company-manager/task/task-list/task-list.component';
import { DebtReportComponent } from './components/personal-area/company-manager/reports/debt-report/debt-report.component';
import { TherapistHomeSettingComponent } from './components/personal-area/therapist/settings/therapist-home-setting/therapist-home-setting.component';
import { TutorialVideosComponent } from './components/personal-area/company-manager/helps/tutorial-videos/tutorial-videos.component';
import { SessionsSheetComponent } from './components/personal-area/patient/sessions-sheet/sessions-sheet.component';
import { LinebreaksPipe } from './pipes/linebreaks.pipe';

import { TreatmentTypesListComponent } from './components/personal-area/company-manager/treatment-types/treatment-types-list/treatment-types-list.component';
import { AddTreatmentTypeDialogComponent } from './components/personal-area/company-manager/treatment-types/add-treatment-type-dialog/add-treatment-type-dialog.component';

@NgModule({
  declarations: [
    SecretaryHomeComponent,
    AppComponent,
    PatientListComponent,
    PatientNameFilterPipe,
    RegistrationFormComponent,
    LogInComponent,
    AdminDashboardComponent,
    SecretaryDashboardComponent,
    TherapistCalendarComponent,
    PatientDashboardComponent,
    TherapistDashboardComponent,
    AppointmentListComponent,
    AddPatientDialogComponent,
    AddAppointmentDialogComponent,
    TreatmentSummaryComponent,
    PatientDetailsComponent,
    TherapistListComponent,
    AddTherapistDialogComponent,
    SecretaryHeaderComponent,
    TherapistHeaderComponent,
    DisplayCalendarComponent,
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
    UserSettingsComponent,
    AddPatientProblemComponent,
    PatientProblemTableComponent,
    AddPatientProblemRatingComponent,
    PatientProblemRatingListComponent,
    TherapistSettingsMenuComponent,
    TherapistSettingsViewComponent,
    AddTaskComponent,
    TaskListComponent,
    DebtReportComponent,
    TherapistHomeSettingComponent,
    SessionsSheetComponent,
    LinebreaksPipe,
    TreatmentTypesListComponent,
  // TutorialVideosComponent (standalone),
  ],
  imports: [
    TutorialVideosComponent,
    NgChartsModule,
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
    TutorialVideosComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }