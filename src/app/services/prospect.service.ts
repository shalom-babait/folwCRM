
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
  return this.http.post<Prospect>(this.apiUrl + '/create', prospectData);
}

  getAllProspects(): Observable<Prospect[]> {
    return this.http.get<Prospect[]>(this.apiUrl + '/getAll');
  }

  deleteProspect(prospectId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${prospectId}`);
  }
  
  assignCategories(prospectId: number, categoryIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${prospectId}/categories`, { category_ids: categoryIds });
  }
  updateProspect(prospectId: number, prospectData: Partial<Prospect>): Observable<Prospect> {
    console.log('Updating prospect with ID:', prospectId, 'and data:', prospectData);
    return this.http.put<Prospect>(`${this.apiUrl}/updateWithCategories/${prospectId}`, prospectData); 
   }
   updateProspectWithCategories(prospectId: number, prospectData: Partial<Prospect> & { category_ids: number[] }): Observable<Prospect> {
  return this.http.put<Prospect>(`${this.apiUrl}/updateWithCategories/${prospectId}`, prospectData);
}
}