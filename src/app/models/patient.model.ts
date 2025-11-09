import { SelectedDepartmentForSave } from "./department-group.model";
import { UserData } from "./user.model";

// מודל Patient מייצג מטופל בהתאם לטבלת Patients במסד הנתונים.
export interface Patient {
  patient_id?: number;
  user_id: number;
  therapist_id?: number;
  birth_date?: string; // YYYY-MM-DD
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}
export interface CreatePatientRequest {
  user_id: number;
  therapist_id?: number;
  birth_date?: string;
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  patient_id: number;
}
export interface PatientData {
  patient_id?: number;
  user_id: number;
  therapist_id?: number;
  birth_date?: string; // YYYY-MM-DD
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

export interface PatientCreationData {
  user: UserData;
  patient: PatientData;
  selectedDepartments: SelectedDepartmentForSave[];
}
