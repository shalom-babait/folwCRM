 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Room, RoomAvailability } from 'src/app/models/room.model';
  

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteRoom/${roomId}`);
  }
  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl + '/getRooms');
  }
  addRoom(room: { room: Room }): Observable<Room> {
    return this.http.post<Room>(this.apiUrl + '/addRoom', room);
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(this.apiUrl + `/updateRoom/${room.room_id}`, room);
  }
  getRoomAvailability(roomId: number): Observable<RoomAvailability[]> {
    return this.http.get<RoomAvailability[]>(`${this.apiUrl}/availability/${roomId}`);
  }
   saveRoomAvailability(roomId: number, availability: RoomAvailability[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/availability/${roomId}`, availability);
  }

}