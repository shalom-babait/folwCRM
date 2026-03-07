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
  customMode = false;
  customStartDate: string = '';
  customEndDate: string = '';

  typedReportData: AppointmentReportItem[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private reportsService: ReportsService) {}

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

  /**
   * סינון דוח לפי בחירת כפתור: 'current' | 'prev' | 'last3' | 'custom'
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
  typedReportData: AppointmentReportItem[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private reportsService: ReportsService) {}

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

  /**
   * סינון דוח לפי בחירת כפתור: 'current' | 'prev' | 'last3' | 'custom'
   */
  onFilterSelect(type: 'current' | 'prev' | 'last3' | 'custom', customRange?: {start: Date, end: Date}) {
    if (type !== 'custom') {
      this.customMode = false;
    }
  let start: Date | null = null;
  let end: Date | null = null;
    const now = new Date();
    if (type === 'current') {
      // החודש הנוכחי
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (type === 'prev') {
      // חודש קודם
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
      end = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    } else if (type === 'last3') {
      // 3 חודשים אחרונים (כולל החודש הנוכחי)
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (type === 'custom' && customRange) {
      start = customRange.start;
      end = customRange.end;
      this.fetchReport(start, end);
      return;
    } else if (type === 'custom') {
      // ממתין לבחירת טווח מהמשתמש
      return;
    }
    if (start && end) {
      this.fetchReport(start, end);
    }

  }

  onCustomRangeSubmit() {
    if (!this.customStartDate || !this.customEndDate) {
      alert('יש לבחור תאריכים');
      return;
    }
    const start = new Date(this.customStartDate);
    const end = new Date(this.customEndDate);
    this.onFilterSelect('custom', { start, end });
  }

  /**
   * שליפת דוח לפי טווח תאריכים מלא
   */
  fetchReport(start: Date, end: Date) {
    this.isLoading = true;
    this.error = null;
    const therapist_id = Number(localStorage.getItem('therapist_id')) || 1;
    const organization_id = Number(localStorage.getItem('organization_id')) || 1;
    const start_date = this.formatDate(start);
    const end_date = this.formatDate(end);
  const body = { therapist_id, organization_id, start_date, end_date };
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

  /**
   * פורמט תאריך yyyy-mm-dd
   */
  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  ngOnInit(): void {
    // כברירת מחדל נטען את "החודש"
    this.onFilterSelect('current');
  }
}
