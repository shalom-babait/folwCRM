import { Component, Input } from '@angular/core';
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

  ngOnChanges() {
    if (this.room) {
      this.editedName = this.room.room_name;
      this.roomColor = this.room.color || '#ffffff';
    }
  }

  onSave() {
    if (this.room) {
      this.room.room_name = this.editedName;
      this.room.color = this.roomColor;
      this.editMode = false;
      // כאן אפשר להוסיף קריאה לשרת לעדכון
    }
  }
}
