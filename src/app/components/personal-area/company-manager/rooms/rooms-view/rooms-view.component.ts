import { Component } from '@angular/core';
import { Room } from 'src/app/models/room.model';
import { Appointment } from 'src/app/models/appointment.model';
import { PatientService } from 'src/app/services/patient.service';
import { ApppointmentService } from 'src/app/services/apppointment.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-rooms-view',
  templateUrl: './rooms-view.component.html',
  styleUrls: [
    './rooms-view.component.css',
    '../../../../../styles/views.css',
  ]
})
export class RoomsViewComponent {
  selectedRoom: Room | null = null;
  activeTab: string = 'home';
  selectedRoomEvents: Appointment[] = [];

  constructor(
    private patientService: PatientService,
    private apppointmentService: ApppointmentService,
    private roomsService: RoomsService
  ) {}

  onRoomAction(event: { room: Room, tab: 'details' | 'settings' | 'delete' }): void {
    this.selectedRoom = event.room;
    switch (event.tab) {
      case 'details':
        this.activeTab = 'calendar';
        break;
      case 'settings':
        this.activeTab = 'settings';
        break;
      case 'delete':
        this.activeTab = 'delete';
        break;
    }
  }

  confirmDeleteRoom(): void {
    if (this.selectedRoom && this.selectedRoom.room_id) {
      this.roomsService.deleteRoom(this.selectedRoom.room_id).subscribe({
        next: () => {
          this.selectedRoom = null;
          this.activeTab = 'home';
        },
        error: () => {
          alert('שגיאה במחיקת החדר. אנא נסה שוב מאוחר יותר.');
        }
      });
    }
  }

  onRoomSelected(room: Room): void {
    this.selectedRoom = room;
    this.activeTab = 'calendar';
    if (room?.room_id) {
  this.apppointmentService.getAppointmentsByRoom(room.room_id).subscribe((appointments: Appointment[]) => {
        this.selectedRoomEvents = appointments.map(app => {
          let dateStr = '';
          if (app.appointment_date) {
            const dateObj = new Date(app.appointment_date);
            dateStr = dateObj.getFullYear() + '-' +
              String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
              String(dateObj.getDate()).padStart(2, '0');
          }
          return {
            ...app,
            title: 'פגישה',
            start: dateStr + 'T' + app.start_time,
            end: dateStr + 'T' + app.end_time,
            color: '#1a237e'
          };
        });
      });
    } else {
      this.selectedRoomEvents = [];
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onCloseDetails(): void {
    this.selectedRoom = null;
    this.activeTab = 'calendar';
  }

  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }
}
