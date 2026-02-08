import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationsService {
  private apiUrl = '/api/organizations';

  constructor(private http: HttpClient) {}

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl);
  }

  addOrganization(org: Organization): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, org);
  }

  updateOrganization(org: Organization): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/${org.id}`, org);
  }

  deleteOrganization(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
