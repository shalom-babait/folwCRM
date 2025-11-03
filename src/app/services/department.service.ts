import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Department, Group, UserDepartment, DepartmentWithGroups } from 'src/app/models/department-group.model';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) { }

  // קבלת כל המחלקות
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  // הוספת מחלקה חדשה
  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  // עריכת מחלקה קיימת
  editDepartment(department_id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${department_id}`, department);
  }

  // מחיקת מחלקה
  deleteDepartment(department_id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${department_id}`);
  }


  // קבלת משתמשים במחלקה
  getUserDepartments(user_id: number): Observable<UserDepartment[]> {
    return this.http.get<UserDepartment[]>(`${this.apiUrl}/user/${user_id}/departments`);
  }
  // קבלת כל המחלקות עם הקבוצות שלהן
  getDepartmentsWithGroups(): Observable<DepartmentWithGroups[]> {
    console.log('Fetching departments with groups from', `${this.apiUrl}/with-groups`);
    return this.http.get<any>(`${this.apiUrl}/with-groups`).pipe(
      tap(response => console.log('Received departments with groups:', response)),
      map(response => response.data)
    );
  }
}
