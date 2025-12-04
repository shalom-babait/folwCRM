import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Type } from 'src/app/models/type.model';

@Injectable({
  providedIn: 'root'
})
export class TypesService {
  private apiUrl = `${environment.apiUrl}/types`;

  constructor(private http: HttpClient) { }

  getTypes(patientId: number): Observable<Type[]> {
    return this.http.get<Type[]>(this.apiUrl + '/getTypes/' + patientId);
  }
}