import { Component, Input } from '@angular/core';
import { RoomsService } from 'src/app/services/rooms.service';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.css']
})
export class RoomSettingsComponent {
  @Input() room!: Room;
  roomColor: string = '#ffffff';
  editMode: boolean = false;
  editedName: string = '';
  isSaving: boolean = false;

  constructor(private roomsService: RoomsService) {}

  ngOnChanges() {
    if (this.room) {
      this.editedName = this.room.room_name;
      this.roomColor = this.room.color || '#ffffff';
    }
  }

  onSave() {
    if (this.room) {
      this.isSaving = true;
      const updatedRoom: Room = {
        ...this.room,
        room_name: this.editedName,
        color: this.roomColor
      };
      this.roomsService.updateRoom(updatedRoom).subscribe({
        next: () => {
          this.room.room_name = this.editedName;
          this.room.color = this.roomColor;
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
