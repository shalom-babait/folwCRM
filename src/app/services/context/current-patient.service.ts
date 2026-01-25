import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PatientCreationData } from 'src/app/models/patient.model';

@Injectable({ providedIn: 'root' })
export class CurrentPatientService {
  private patientSubject = new BehaviorSubject<PatientCreationData | null>(null);

  // Observable למנויים
  patient$ = this.patientSubject.asObservable();

  // קבלת המטופל הנבחר
  getPatient(): PatientCreationData | null {
    return this.patientSubject.value;
  }

  // הגדרת מטופל נבחר
  setPatient(patient: PatientCreationData | null) {
    this.patientSubject.next(patient);
  }
}
