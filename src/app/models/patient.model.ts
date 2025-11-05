// מייצג מטופל כולל נתוני משתמש (תואם למסד הנתונים)
export interface Patient {
  patient_id?: number;
  user_id?: number;
  therapist_id?: number;

  first_name?: string;
  last_name?: string;
  birth_date?: string; // YYYY-MM-DD
  gender?: 'זכר' | 'נקבה' | 'אחר'; // זהה ל-ENUM במסד
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה'; // זהה ל-ENUM במסד
  history_notes?: string;

  phone?: string;
  email?: string;
  address?: string;
  teudat_zehut?: string;
  city?: string;
  departments?: string[];
  marital_status?: string;
  treatment_count?: number;
}

// נתונים בסיסיים של מטופל לצורך יצירה/עדכון
export interface PatientBase {
  therapist_id?: number;
  birth_date?: string;
  gender?: 'זכר' | 'נקבה' | 'אחר'; // ENUM זהה למסד
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה'; // ENUM זהה למסד
  history_notes?: string;
}

// בקשת יצירה של מטופל חדש
export interface CreatePatientRequest extends PatientBase {
  user_id: number; // חובה בעת יצירה
}

// בקשת עדכון של מטופל קיים
export interface UpdatePatientRequest extends Partial<PatientBase> {
  patient_id: number;
}
