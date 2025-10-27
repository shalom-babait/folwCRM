import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Type {
  type_id: number;
  type_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TypesService {
  private apiUrl = `${environment.apiUrl}/types`;

  constructor(private http: HttpClient) { }

  getTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(this.apiUrl + '/getTypes');
  }
}