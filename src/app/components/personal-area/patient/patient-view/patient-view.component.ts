import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PatientCreationData } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css', '../../../../styles/views.css']
})
export class PatientViewComponent {
  @Input() therapistId?: number;
  selectedPatient: PatientCreationData | null = null;
  activeTab: string = 'details';
  searchTerm: string = '';
  loading: boolean = false;
  payments: any[] = [];


  /** עדכון פרטי מטופל */

  userId: number | null = null;

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) {
    this.userId = this.authService.getCurrentUserId();
  }


  /** טיפול בעדכון פרטי מטופל */
  onPatientUpdated(updated: any): void {
    if (!updated || !updated.patient || !updated.patient.patient_id || !updated.person) return;
    this.loading = true;

    // בניית אובייקט עדכון מאוחד
    let updateReq: any = {
      ...updated.patient,
      ...updated.person,
      patient_id: updated.patient.patient_id,
      user_id: updated.person.user_id,
      birth_date: updated.person.birth_date || updated.patient.birth_date
    };

    // המרת ערכים ריקים ל-null
    Object.keys(updateReq).forEach(key => {
      if (updateReq[key] === '') {
        updateReq[key] = null;
      }
    });

    console.log('נשלח לעדכון:', updateReq);

    this.patientService.updatePatient(updateReq.patient_id, updateReq).subscribe({
      next: (res) => {
        if (res && res.success) {
          const id = updated.patient.patient_id;
          this.patientService.getPatientOnly(id).subscribe(fullPatient => {
            if (fullPatient && fullPatient.person && fullPatient.patient) {
              this.selectedPatient = fullPatient;
              this.patientService.updatePatientInList(fullPatient);
            } else {
              this.selectedPatient = updated;
              this.patientService.updatePatientInList(updated);
            }
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

  /** בחירת מטופל */
  onPatientSelected(patient: PatientCreationData): void {
    this.selectedPatient = patient;
    this.activeTab = 'details';
  }

  /** החלפת טאב */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /** בדיקת טאב */
  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  /** סגירת התצוגה */
  onCloseDetails(): void {
    this.selectedPatient = null;
    this.activeTab = 'details';
  }
}
