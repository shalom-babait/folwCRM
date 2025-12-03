import { Component, OnInit } from '@angular/core';
import { PatientCreationData } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css',
    '../../../../styles/views.css'
  ]
})
export class PatientViewComponent {
    /** עדכון פרטי מטופל */
    onPatientUpdated(updated: any): void {
      if (!updated || !updated.patient || !updated.patient.patient_id) return;
      this.loading = true;
      // בניית אובייקט עדכון לפי המודל (הנתונים כבר מוכנים)
      const updateReq: any = {
        ...updated.patient,
        ...updated.user,
        patient_id: updated.patient.patient_id,
        user_id: updated.user.user_id,
        birth_date: updated.user.birth_date || updated.patient.birth_date
      };
      // הסר gender אם קיים (בעברית או באנגלית)
      if ('gender' in updateReq) {
        delete updateReq.gender;
      }
      this.patientService.updatePatient(updateReq.patient_id, updateReq).subscribe({
        next: (res) => {
          console.log('תשובת עדכון מהשרת:', res);
          if (res && res.success) {
            // אין patient_id בתשובה, לכן נשתמש ב-id מהאובייקט שנשלח
            const id = updated.patient.patient_id;
            this.patientService.getPatientOnly(id).subscribe(fullPatient => {
          if (fullPatient && fullPatient.person && fullPatient.patient) {                this.selectedPatient = fullPatient;
                this.patientService.updatePatientInList(fullPatient);
              } else {
                // נעדכן מהערך שנשלח (updated)
                this.selectedPatient = updated;
                this.patientService.updatePatientInList(updated);
              }
              alert('העדכון בוצע בהצלחה!');
              this.loading = false;
            }, () => {
              // במקרה של שגיאה בשליפה, נעדכן מהערך שנשלח
              this.selectedPatient = updated;
              this.patientService.updatePatientInList(updated);
              alert('העדכון בוצע בהצלחה!');
              this.loading = false;
            });
          } else {
            alert('העדכון נכשל.');
            this.loading = false;
          }
        },
        error: () => {
          alert('אירעה שגיאה בעדכון.');
          this.loading = false;
        }
      });
    }
  selectedPatient: PatientCreationData | null = null;
  activeTab: string = 'details';
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private patientService: PatientService) {}

  /** כאשר נבחר מטופל מהרשימה */
  onPatientSelected(patient: PatientCreationData): void {
    this.selectedPatient = patient;
    this.activeTab = 'details';
  }

  /** החלפת טאב פעיל */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /** בודק אם טאב מסוים פעיל */
  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  /** סגירת תצוגת פרטים וחזרה לרשימה */
  onCloseDetails(): void {
    this.selectedPatient = null;
    this.activeTab = 'details';
  }
}
