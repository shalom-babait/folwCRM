import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FollowUp, FollowUpWithPerson } from '../models/followup.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FollowupService {
  private apiUrl = `${environment.apiUrl}/followups`;

  constructor(private http: HttpClient) { }

  addFollowup(followup: FollowUp): Observable<any> {
    // ודא שיש סטטוס כברירת מחדל
    if (!followup.status) {
      followup.status = 'open';
    }
    console.log('Adding followup with data:', followup);
    return this.http.post(`${this.apiUrl}`, followup);
  }
  updateFollowupStatus(followupId: number, status: 'open' | 'completed' | 'cancelled'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${followupId}`, { status });
  }

  getFollowupsByCreator(created_by_user_id: number): Observable<FollowUpWithPerson[]> {
    console.log(created_by_user_id, "created_by_user_id");
    
    return this.http.get<FollowUpWithPerson[]>(`${this.apiUrl}/creator/${created_by_user_id}`);
  }

  getFollowupsByPerson(personId: number): Observable<FollowUp[]> {
    return this.http.get<FollowUp[]>(`${this.apiUrl}/person/${personId}`);
  }

  updateFollowup(followup: FollowUp): Observable<any> {
    if (!followup.followup_id) throw new Error('Missing followup_id for update');
    return this.http.put(`${this.apiUrl}/${followup.followup_id}`, followup);
  }

  updateFollowupReminder(followupId: number, remind: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${followupId}`, { remind });
  }

  deleteFollowup(followupId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${followupId}`);
  }

}
