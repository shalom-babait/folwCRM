import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientProblem, CreatePatientProblemRating, PatientProblemRating } from '../models/patient-problems';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientProblemsService {
  private apiUrl = environment.apiUrl + '/patient-problems';

  constructor(private http: HttpClient) { }

  /**
   * קבלת כל דירוגי הבעיה (רשימה מלאה) לפי מזהה בעיה
   */
  getProblemRatingsByProblemId(patient_problem_id: number): Observable<PatientProblemRating[]> {
  console.log('מזהה בעיה (patient_problem_id):', patient_problem_id);
  return this.http.get<PatientProblemRating[]>(`${this.apiUrl}/${patient_problem_id}/problem-ratings-list`);
  }

  /**
   * קבלת כל הבעיות של מטופל לפי מזהה מטופל
   */
  getProblemsByPatientId(patient_id: number): Observable<PatientProblem[]> {
    return this.http.get<PatientProblem[]>(`${this.apiUrl}/by-patient/${patient_id}`);
  }

  /**
   * קבלת כל הדירוגים של בעיה לפי מזהה בעיה (נתיב חדש)
   */
  getRatingsByProblemId(patient_problem_id: number): Observable<PatientProblemRating[]> {
    return this.http.get<PatientProblemRating[]>(`${this.apiUrl}/${patient_problem_id}/problem-ratings-list`);[]
  }
  /**
   * הוספת בעיה חדשה למטופל
   */
  addPatientProblem(problem: Omit<PatientProblem, 'patient_problem_id'>): Observable<PatientProblem> {
    return this.http.post<PatientProblem>(`${this.apiUrl}/add`, problem);
  }
  /**
   * הוספת דירוג לבעיה קיימת (נתיב חדש)
   */
  addProblemRating(patient_problem_id: number, rating: Omit<CreatePatientProblemRating, 'patient_problem_id'>): Observable<PatientProblemRating> {
    console.log('נתוני דירוג שנשלחים לשרת:', { patient_problem_id, ...rating });
    return this.http.post<PatientProblemRating>(`${this.apiUrl}/${patient_problem_id}/problem-ratings`, rating);
  }

  /**
   * מחיקת דירוג לבעיה
   */
  deleteProblemRating(patient_problem_rating_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-problem-rating-by-ratingId/${patient_problem_rating_id}`);
  }
  /**
   * מחיקת בעיה של מטופל לפי מזהה בעיה
   */
  deletePatientProblem(patient_problem_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-problem-rating-by-ratingId/${patient_problem_id}`);
  }
}
