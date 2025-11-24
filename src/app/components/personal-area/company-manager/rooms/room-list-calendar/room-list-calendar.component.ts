import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Room } from 'src/app/models/room.model';
import { RoomsService } from 'src/app/services/rooms.service';
import { PatientService } from 'src/app/services/patient.service';
import { Appointment } from 'src/app/models/appointment.model';
import { UserService } from 'src/app/services/user.service';
import { TherapistCreationData } from 'src/app/models/therapist.model';

@Component({
  selector: 'app-room-list-calendar',
  templateUrl: './room-list-calendar.component.html',
  styleUrls: [
    './room-list-calendar.component.css',
    '../../../../../styles/list-cards.css'
  ]
})
export class RoomListCalendarComponent implements OnInit {
  rooms: Room[] = [];
  selectedRoomId: number | null = null;
  roomEvents: Appointment[] = [];
  therapists: TherapistCreationData[] = [];

  @Output() roomSelected = new EventEmitter<Room>();

  constructor(
    private roomsService: RoomsService,
    private patientService: PatientService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.roomsService.getRooms().subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    });
    this.userService.getAllTherapists().subscribe((therapists: TherapistCreationData[]) => {
      this.therapists = therapists;
    });
  }

  getTherapistName(therapistId: number): string {
    const therapist = this.therapists.find(t => t.therapist.therapist_id === therapistId);
    if (therapist) {
      return therapist.user.first_name + ' ' + therapist.user.last_name;
    }
    return '';
  }

  selectRoom(roomId: number) {
    this.selectedRoomId = roomId;
    const selectedRoom = this.rooms.find(r => r.room_id === roomId);
    if (selectedRoom) {
      this.roomSelected.emit(selectedRoom);
    }
    this.patientService.getAppointmentsByRoomId(roomId).subscribe((appointments: Appointment[]) => {
      this.roomEvents = appointments.map((app: Appointment) => {
        let dateStr = '';
        if (app.appointment_date) {
          const dateObj = new Date(app.appointment_date);
          dateStr = dateObj.getFullYear() + '-' +
            String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
            String(dateObj.getDate()).padStart(2, '0');
        }
        const therapistName = this.getTherapistName(app.therapist_id);
        return {
          ...app,
          title: therapistName ? therapistName : 'פגישה',
          start: dateStr + 'T' + app.start_time,
          end: dateStr + 'T' + app.end_time,
          color: '#1a237e'
        };
      });
    });
  }
}
