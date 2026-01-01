import { Component, Input, OnInit } from '@angular/core';
import { RoomsService } from 'src/app/services/rooms.service';
import { Room, RoomAvailability } from 'src/app/models/room.model';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.css']
})
export class RoomSettingsComponent {
  daysOfWeek: string[] = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  roomAvailability: (RoomAvailability & { available?: boolean })[] = [
    { day_of_week: 0, start_time: '08:00', end_time: '20:00', company_id: 0, room_id: 0, available: true },
    { day_of_week: 1, start_time: '08:00', end_time: '20:00', company_id: 0, room_id: 0, available: true },
    { day_of_week: 2, start_time: '08:00', end_time: '20:00', company_id: 0, room_id: 0, available: true },
    { day_of_week: 3, start_time: '08:00', end_time: '20:00', company_id: 0, room_id: 0, available: true },
    { day_of_week: 4, start_time: '08:00', end_time: '20:00', company_id: 0, room_id: 0, available: true },
    { day_of_week: 5, start_time: '08:00', end_time: '20:00', company_id: 0, room_id: 0, available: true },
    { day_of_week: 6, start_time: '08:00', end_time: '20:00', company_id: 0, room_id: 0, available: true },
  ];
  @Input() room!: Room;
  roomColor: string = '#ffffff';
  editMode: boolean = false;
  editedName: string = '';
  isSaving: boolean = false;
  editedDescription: string = '';

  constructor(private roomsService: RoomsService) {}

  ngOnChanges() {
    if (this.room) {
      this.editedName = this.room.room_name;
      this.roomColor = this.room.color || '#ffffff';
      this.editedDescription = this.room.description || '';
      // כאן נטען זמינות אמיתית מהשרת בעתיד
      this.roomAvailability.forEach(a => {
        a.room_id = this.room.room_id;
        // company_id יש להכניס מההקשר שלך
      });
    }
  }

  applySameHoursToAll() {
    if (this.roomAvailability.length > 0) {
      const first = this.roomAvailability[0];
      for (let i = 1; i < this.roomAvailability.length; i++) {
        this.roomAvailability[i].start_time = first.start_time;
        this.roomAvailability[i].end_time = first.end_time;
      }
    }
  }

  onSave() {
    if (this.room) {
      this.isSaving = true;
      const updatedRoom: Room = {
        ...this.room,
        room_name: this.editedName,
        color: this.roomColor,
        description: this.editedDescription
      };
      // כאן יש לשמור גם את זמינות החדר לשרת
      this.roomsService.updateRoom(updatedRoom).subscribe({
        next: () => {
          this.room.room_name = this.editedName;
          this.room.color = this.roomColor;
          this.room.description = this.editedDescription;
          // כאן יש לשמור את this.roomAvailability לשרת
          this.editMode = false;
          this.isSaving = false;
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Failed to update room:', err);
        }
      });
    }
  }
}
