import { SelectedDepartmentForSave } from "./department-group.model";
import { UserData } from "./user.model";
import { Person } from "./person.model"; // להוסיף קובץ עם המודל ששלחתי קודם

export interface Patient {
  patient_id?: number;
  user_id: number;
  therapist_id?: number | null | undefined;
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

export interface PatientBase {
  therapist_id?: number | null | undefined;
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

export interface CreatePatientRequest extends PatientBase {
  user_id: number;
}

export interface UpdatePatientRequest extends Partial<PatientBase> {
  therapist_id?: number | null | undefined;
}

// נתוני מטופל מלאים (כולל פרטי Person)
export interface PatientData {
  patient_id?: number;
  user_id: number;
  therapist_id?: number | null | undefined;
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
  person?: Person; // פרטי המטופל האישיים
}

// אובייקט ליצירת מטופל כולל משתמש, פרסון ושיוך מחלקות
export interface PatientCreationData {
  person: Person; // פרטי המטופל האישיים
  patient: PatientData; // פרטי המטופל מטבלת Patients
  selectedDepartments: SelectedDepartmentForSave[];
}