import { Component, Input, OnInit } from '@angular/core';
import { RoomsService } from 'src/app/services/rooms.service';
import { Room, RoomAvailability } from 'src/app/models/room.model';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.css']
})
export class RoomSettingsComponent {
    saveMessage: string = '';

  // ימים בשבוע: 0=ראשון, 1=שני, ... 6=שבת
  daysOfWeek: string[] = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  groupedAvailabilityOrEmpty: { day_of_week: number, dayName: string, availabilities: (RoomAvailability & { available?: boolean })[] }[] = [];
  get groupedAvailability() {
    const groups: { day_of_week: number, dayName: string, availabilities: (RoomAvailability & { available?: boolean })[] }[] = [];
    for (let i = 0; i < 7; i++) {
        const avails = this.roomAvailability.filter(a => (a.day_of_week - 1) === i);
      if (avails.length > 0) {
        groups.push({ day_of_week: i, dayName: this.daysOfWeek[i], availabilities: avails });
      }
    }
    return groups;
  }
  roomAvailability: (RoomAvailability & { available?: boolean })[] = [];
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
      this.roomsService.getRoomAvailability(this.room.room_id).subscribe({
        next: (availability) => {
          this.roomAvailability = availability;
          this.updateGroupedAvailability();
        },
        error: (err) => {
          console.error('Failed to load room availability:', err);
        }
      });
    }
  }

  updateGroupedAvailability() {
    const groups: { day_of_week: number, dayName: string, availabilities: (RoomAvailability & { available?: boolean })[] }[] = [];
    for (let i = 0; i < 7; i++) {
        const avails = this.roomAvailability.filter(a => (a.day_of_week - 1) === i);
      groups.push({ day_of_week: i, dayName: this.daysOfWeek[i], availabilities: avails });
    }
    this.groupedAvailabilityOrEmpty = groups;
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
      this.roomsService.updateRoom(updatedRoom).subscribe({
        next: () => {
          this.room.room_name = this.editedName;
          this.room.color = this.roomColor;
          this.room.description = this.editedDescription;
          this.roomsService.saveRoomAvailability(this.room.room_id, this.roomAvailability).subscribe({
            next: () => {
              this.editMode = false;
              this.isSaving = false;
            },
            error: (err) => {
              this.isSaving = false;
              console.error('Failed to save room availability:', err);
            }
          });
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Failed to update room:', err);
        }
      });
    }
  }
    addTimeRange(dayIdx: number) {
    // company_id נלקח מהטווח הראשון הקיים, ואם אין אז 0
    const companyId = this.roomAvailability[0]?.company_id ?? 0;
    const newRange: RoomAvailability = {
      company_id: companyId,
      room_id: this.room.room_id,
      day_of_week: dayIdx + 1, // ב-DB 1=ראשון
      start_time: '08:00',
      end_time: '17:00',
    };
    this.roomAvailability.push(newRange);
    this.updateGroupedAvailability();
  }

  removeTimeRange(dayIdx: number, availIdx: number) {
    const dayRanges = this.roomAvailability.filter(a => (a.day_of_week - 1) === dayIdx);
    const toRemove = dayRanges[availIdx];
    const idx = this.roomAvailability.indexOf(toRemove);
    if (idx > -1) {
      this.roomAvailability.splice(idx, 1);
      this.updateGroupedAvailability();
    }
  }
}
