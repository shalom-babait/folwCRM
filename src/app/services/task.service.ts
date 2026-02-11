
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  getTasksByUserId(user_id: number): Observable<Task[]> {
    console.log(user_id , "user_id in service");
    return this.http.get<Task[]>(`${this.apiUrl}/by-user/${user_id}`);
  }
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/add-task`, task);
  }

  deleteTask(task_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${task_id}`);
  }

  updateTask(task_id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task_id}`, task);
  }

  getTasksByPatientId(patient_id: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/by-patient/${patient_id}`);
  }
}
