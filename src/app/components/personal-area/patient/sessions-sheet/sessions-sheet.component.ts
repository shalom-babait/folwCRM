import { Component, Inject } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApppointmentService } from 'src/app/services/apppointment.service';
@Component({
  selector: 'app-sessions-sheet',
  templateUrl: './sessions-sheet.component.html',
  styleUrls: ['./sessions-sheet.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class SessionsSheetComponent {
  appointments: Appointment[] = [];
  title: string = 'גיליון מפגשים';
  expandedSessions: boolean[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appointmentsService: ApppointmentService
  ) {
    this.appointments = data?.appointments || [];
    this.expandedSessions = new Array(this.appointments.length).fill(true);
  }

  printSheet(): void {
    window.print();
  }

  toggleNotes(index: number): void {
    this.expandedSessions[index] = !this.expandedSessions[index];
  }
  onSave(app: any) {
    if (app.appointment_id != null) {
      this.updateNotes(app.appointment_id, app.notes);
    }
    app.isEditing = false;
  }
  updateNotes(appointmentId: number, notes: string): void {
    this.appointmentsService.updateNotes(appointmentId, notes)
      .subscribe();
  }
}