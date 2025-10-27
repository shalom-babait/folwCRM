export interface CreateAppointmentRequest {
  therapist_id: number;
  patient_id: number;
  type_id: number;
  room_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
  cost?: number;
}

export interface AppointmentResponse extends Appointment {
  // שדות נוספים מהשרת אם יש
}
// מודל Appointment מייצג פגישה טיפולית בין מטפל למטופל בהתאם לטבלת 
export interface Appointment {
  appointment_id?: number;
  therapist_id: number;
  patient_id: number;
  type_id: number;
  room_id: number;
  appointment_date: string;  // YYYY-MM-DD
  start_time: string;        // HH:MM:SS
  end_time: string;          // HH:MM:SS
  total_minutes?: number;
  status?: 'מתוזמנת' | 'הושלמה' | 'בוטלה';
  notes?: string;
  cost?: number;
}
export interface AppointmentFormInput {
  therapist_id: number;
  patient_id: number;
  type_id: number;
  room_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  // אפשר להוסיף שדות עזר להצגה בלבד
}
