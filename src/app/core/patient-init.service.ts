import { Injectable } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { PatientStateService } from '../services/state/patient-state.service';

@Injectable({ providedIn: 'root' })
export class PatientInitService {
  constructor(
    private patientService: PatientService,
    private patientState: PatientStateService
  ) {}

  /**
   * Load all patients from server and update the state service
   */
  loadAllPatientsToState() {
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        // patients: PatientCreationData[]
        // extract .patient and .person for PatientData[]
        const patientDataArr = patients.map(p => ({ ...p.patient, person: p.person }));
        this.patientState.setPatients(patientDataArr);
      },
      error: (err) => {
        this.patientState.setError('שגיאה בטעינת רשימת מטופלים');
        console.error('שגיאה בטעינת רשימת מטופלים', err);
      }
    });
  }
}
