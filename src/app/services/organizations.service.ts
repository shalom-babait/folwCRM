import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization } from '../models/organization.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrganizationsService {
  private apiUrl = `${environment.apiUrl}/organizations`;

  constructor(private http: HttpClient) {}

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<{ success: boolean, data: Organization[] }>(`${this.apiUrl}/getAll`)
      .pipe(map(res => res.data));
  }

  addOrganization(org: Organization): Observable<Organization> {
    return this.http.post<Organization>(`${this.apiUrl}/create`, org);
  }

  updateOrganization(org: Organization): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/${org.organization_id}`, org);
  }

  deleteOrganization(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
