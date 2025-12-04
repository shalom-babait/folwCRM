import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponseGroup, Group, UserGroup } from '../models/department-group.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) { }

  // קבלת כל הקבוצות כולל שם המחלקה
  getAllGroupsWithDepartment(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/all`);
  }

  // הוספת קבוצה חדשה למחלקה
  addGroup(group: { group_name: string, department_id: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add_group`, group);
  }

  // עריכת קבוצה קיימת
  editGroup(group_id: number, group: Group): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${group_id}`, group);
  }

  // מחיקת קבוצה
  deleteGroup(group_id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${group_id}`);
  }

  // קבלת משתמשים בקבוצה

  getGroupUsers(group_id: number): Observable<ApiResponseGroup<UserGroup[]>> {
    return this.http.get<ApiResponseGroup<UserGroup[]>>(`${this.apiUrl}/group_users/${group_id}`);
  }

  getTherapistsByGroup(group_id: number): Observable<ApiResponseGroup<UserGroup[]>> {
    return this.http.get<ApiResponseGroup<UserGroup[]>>(`${this.apiUrl}/group_therapists/${group_id}`);
  }

  getAppointmentsByGroup(group_id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/appointments/group/${group_id}`);
  }
}
