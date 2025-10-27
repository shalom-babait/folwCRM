// מודל Patient מייצג מטופל בהתאם לטבלת Patients במסד הנתונים.
export interface Patient {
  patient_id?: number;
  user_id?: number;
  therapist_id?: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
  phone?: string;      
  email?: string;
  address?: string;
  teudat_zehut?: string;
  city?: string;
}
// נתונים ספציפיים למטופל
export interface PatientData {
  patient_id?: number;
  user_id: number;
  therapist_id?: number;
  birth_date?: string;                  // YYYY-MM-DD
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}
export interface CreatePatientRequest {
  patient_id?: number;
  therapist_id?: number;
  birth_date?: string;
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  patient_id: number;
}
