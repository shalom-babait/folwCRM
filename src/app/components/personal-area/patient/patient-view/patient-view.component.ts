import { Component } from '@angular/core';
import { PatientCreationData } from 'src/app/models/patient.model';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css']
})
export class PatientViewComponent {
  selectedPatient: PatientCreationData | null = null;
  activeTab: string = 'details';

  /**
   * מופעל כאשר נבחר מטפל מהרשימה
   */
  onPatientSelected(patient: PatientCreationData): void {
    this.selectedPatient = patient;
    this.activeTab = 'details'; // חזרה לטאב הראשון בכל פעם שבוחרים מטופל חדש
  }

  /**
   * מחליף בין הטאבים השונים
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * סוגר את תצוגת הפרטים וחוזר לסיכום
   */
  onCloseDetails(): void {
    this.selectedPatient = null;
    this.activeTab = 'details';
  }

  /**
   * בודק אם הטאב הנוכחי הוא הפעיל
   */
  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }
}

