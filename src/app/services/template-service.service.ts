import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateServiceService {
  private apiUrl = `${environment.apiUrl}/templates`;
    
  constructor(private http: HttpClient) { }

  getTemplate(templateId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${templateId}`);
  }

  saveAnswers(templateId: number, answers: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${templateId}/answers`, { answers });
  }
}
