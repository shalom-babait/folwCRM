// בעיה אחת של מטופל – ישות קבועה שמלווה את המטופל לאורך זמן.
export interface PatientProblem {
  patient_problem_id?: number;
  patient_id: number;
  title: string;
  description?: string;
  status: 'active' | 'resolved';
  created_at?: string; // ISO date
  closed_at?: string | null; // ISO date | null
  organization_id: number;
}
// מדידה של מצב בעיה מסוימת בתאריך נתון.
export interface PatientProblemRating {
  patient_problem_rating_id?: number;
  patient_problem_id: number;
  rating_date: string; // YYYY-MM-DD
  score: number; // 1–10
  notes?: string;
  created_at?: string; // ISO date
  organization_id: number;
}
// מודל תצוגה משולב – בעיה + כל הדירוגים שלה.
export interface PatientProblemWithRatings extends PatientProblem {
  ratings?: PatientProblemRating[];
  last_score?: number;
  last_rating_date?: string;
}
    // נתונים מינימליים להזנת דירוג חדש.
export interface CreatePatientProblemRating {
  patient_problem_id: number;
  rating_date: string; // YYYY-MM-DD
  score: number;
  notes?: string;
}
