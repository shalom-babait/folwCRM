
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Prospect } from 'src/app/models/Prospect.model';

@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  private apiUrl = environment.apiUrl + '/prospects';

  constructor(private http: HttpClient) { }


createProspect(prospectData: Prospect): Observable<Prospect> {
  console.log('Creating prospect with data:', prospectData);
  return this.http.post<Prospect>(this.apiUrl, prospectData);
}

  getAllProspects(): Observable<Prospect[]> {
    return this.http.get<Prospect[]>(this.apiUrl);
  }

  deleteProspect(prospectId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${prospectId}`);
  }
}