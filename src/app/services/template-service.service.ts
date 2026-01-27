import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateServiceService {
  private baseUrl = '/api/templates';

  constructor(private http: HttpClient) { }

  getTemplate(templateId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${templateId}`);
  }

  saveAnswers(templateId: number, answers: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${templateId}/answers`, { answers });
  }
}
