import { SelectedDepartmentForSave } from "./department-group.model";
import { UserData } from "./user.model";

// --- מודל מטופל (Patient) ---
// מייצג רשומה מטבלת Patients במסד הנתונים
export interface Patient {
  patient_id?: number;
  user_id: number;
  therapist_id?: number;
  birth_date?: string; // YYYY-MM-DD
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

// --- נתונים בסיסיים של מטופל לצורך יצירה/עדכון ---
export interface PatientBase {
  therapist_id?: number;
  birth_date?: string; // YYYY-MM-DD
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

// --- בקשת יצירה של מטופל חדש ---
export interface CreatePatientRequest extends PatientBase {
  user_id: number; // חובה בעת יצירה
}

// --- בקשת עדכון של מטופל קיים ---
export interface UpdatePatientRequest extends Partial<PatientBase> {
  patient_id: number;
}

// --- נתוני מטופל מלאים (כפי שנשלחים/מתקבלים מהשרת) ---
export interface PatientData {
  patient_id?: number;
  user_id: number;
  therapist_id?: number;
  birth_date?: string;
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

// --- אובייקט ליצירת מטופל כולל נתוני משתמש ושיוך מחלקות ---
export interface PatientCreationData {
  user: UserData; // פרטי המשתמש מטבלת Users
  patient: PatientData; // פרטי המטופל מטבלת Patients
  selectedDepartments: SelectedDepartmentForSave[]; // שיוך למחלקות
}
