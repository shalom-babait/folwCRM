import { Component, OnInit } from '@angular/core';
import { MONTH_LABELS } from 'src/app/shared/constants/month-labels';
import { ReportsService } from 'src/app/services/reports.service';
import { AppointmentReportItem } from 'src/app/models/appointment.model';

@Component({
  selector: 'app-appointment-reports',
  templateUrl: './appointment-reports.component.html',
  styleUrls: ['./appointment-reports.component.css']
})
export class AppointmentReportsComponent implements OnInit {
  getHebrewMonthName(): string {
    const now = new Date();
    return MONTH_LABELS[now.getMonth()];
  }
  getTotalHours(appointments: any[]): string {
    if (!appointments || !appointments.length) return '0';
    const totalMinutes = appointments.reduce((sum, appt) => sum + (appt.total_minutes || 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${hours}`;
  }
  typedReportData: AppointmentReportItem[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    const therapist_id = Number(localStorage.getItem('therapist_id')) || 1; // שנה לפי הצורך
    const organization_id = Number(localStorage.getItem('organization_id')) || 1;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const body = { therapist_id, organization_id, year, month };
    this.reportsService.getMonthlyTreatmentsReport(body).subscribe(
      (data: any) => {
        if (data && data.data) {
          this.typedReportData = data.data as AppointmentReportItem[];
        } else {
          this.typedReportData = [];
        }
        this.isLoading = false;
      },
      (error: any) => {
        this.error = 'שגיאה בטעינת דוח פגישות';
        this.isLoading = false;
      }
    );
  }
}
