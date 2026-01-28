import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatientData } from 'src/app/models/patient.model';

interface PatientsState {
  patients: PatientData[];
  selectedPatient: PatientData | null;
  loading: boolean;
  error: string | null;
}

const initialPatientsState: PatientsState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null
};
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientStateService {

  private stateSubject = new BehaviorSubject<PatientsState>(initialPatientsState);
  state$ = this.stateSubject.asObservable();

  // selectors נוחים
  patients$ = this.state$.pipe(map(state => state.patients));
  selectedPatient$ = this.state$.pipe(map(state => state.selectedPatient));
  loading$ = this.state$.pipe(map(state => state.loading));
  error$ = this.state$.pipe(map(state => state.error));

  // actions (שינויים ב-state)
  setPatients(patients: PatientData[]) {
    this.updateState({ patients, loading: false, error: null });
  }

  selectPatient(patient: PatientData) {
    this.updateState({ selectedPatient: patient });
  }

  clearSelectedPatient() {
    this.updateState({ selectedPatient: null });
  }

  setLoading(loading: boolean) {
    this.updateState({ loading });
  }

  setError(error: string) {
    this.updateState({ error, loading: false });
  }

  // פונקציה פנימית לעדכון ה-state
  private updateState(partialState: Partial<PatientsState>) {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partialState
    });
  }
}