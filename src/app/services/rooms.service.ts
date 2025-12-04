
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Room } from 'src/app/models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl + '/getRooms');
  }
  addRoom(room: { room: Room }): Observable<Room> {
  return this.http.post<Room>(this.apiUrl + '/addRoom', room);
}
}