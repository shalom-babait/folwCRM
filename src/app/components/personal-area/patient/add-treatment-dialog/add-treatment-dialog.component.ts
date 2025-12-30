import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { RoomsService } from 'src/app/services/rooms.service';
import { TypesService } from 'src/app/services/types.service';
import { PatientService } from 'src/app/services/patient.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Room } from 'src/app/models/room.model';
import { ConfirmUnsavedDialogComponent } from 'src/app/components/confirm-unsaved-dialog/confirm-unsaved-dialog.component';
import { SelectTimeDialogComponent } from 'src/app/components/select-time-dialog/select-time-dialog.component';

@Component({
  selector: 'app-add-treatment-dialog',
  templateUrl: './add-treatment-dialog.component.html',
  styleUrls: [
    './add-treatment-dialog.component.css',
     '../../../../styles/dialog-forms.css'
  ]
})
export class CreateTreatmentDialogComponent implements OnInit {
  async onCancel(): Promise<void> {
    if (!this.treatmentForm.dirty) {
      this.dialogRef.close();
      return;
    }
    const result = await this.openUnsavedDialog();
    if (result === 'cancel') {
      this.dialogRef.close();
    }
  }

  // Intercept dialog close (backdrop or X)
  async canCloseDialog(): Promise<boolean> {
    if (!this.treatmentForm.dirty) return true;
    const result = await this.openUnsavedDialog();
    return result === 'cancel';
  }

  openUnsavedDialog(): Promise<'save' | 'cancel' | undefined> {
    const dialogRef = this.dialog.open(ConfirmUnsavedDialogComponent, {
      width: '350px',
      data: { message: 'יש שינויים שלא נשמרו. האם לצאת בלי לשמור?' }
    });
    return dialogRef.afterClosed().toPromise();
  }

  @Output() appointmentAdded = new EventEmitter<any>();
  treatmentForm!: FormGroup;

  rooms: Room[] = [];
  types: any[] = [];
  selectedRoomId: number | null = null;
  roomEvents: any[] = [];
  showOverlay = false;

    constructor(
      private fb: FormBuilder,
      private errorHandler: ErrorHandlerService,
      private roomsService: RoomsService,
      private typesService: TypesService,
      private patientService: PatientService,
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<CreateTreatmentDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.treatmentForm = this.createForm();
      if (data) {
        this.treatmentForm.patchValue({
          date: data.appointment_date || data.date || '',
          place: data.room_id || data.place || '',
          type: data.treatment_type_id || data.type || '',
          startTime: data.start_time || data.startTime || '',
          endTime: data.end_time || data.endTime || '',
          notes: data.notes || '',
          meeting_type: data.meeting_type || data.mode || 'frontal',
          patient_id: data.patient_id || null
        });
      } else {
        this.treatmentForm.get('meeting_type')?.setValue('frontal');
      }
      // Disable close on backdrop click or ESC
      this.dialogRef.disableClose = true;
    }

  // Intercept dialog close (backdrop or X)

  ngAfterViewInit(): void {
    // האזנה לאירועי סגירה (ESC, backdrop)
    this.dialogRef.backdropClick().subscribe(async () => {
      if (await this.canCloseDialog()) {
        this.dialogRef.close();
      }
    });
    this.dialogRef.keydownEvents().subscribe(async (event: any) => {
      if (event.key === 'Escape') {
        if (await this.canCloseDialog()) {
          this.dialogRef.close();
        }
      }
    });
  }


  ngOnInit(): void {
    this.treatmentForm.get('meeting_type')?.valueChanges.subscribe(meetingType => {
      if (meetingType === 'phone') {
        this.treatmentForm.get('place')?.setValue(null);
      }
    });

    this.roomsService.getRooms().subscribe({ next: rooms => this.rooms = rooms });
    if (this.data?.patient_id) {
      this.typesService.getTypes(this.data.patient_id).subscribe({ next: types => this.types = types });
    }

    this.treatmentForm.get('place')?.valueChanges.subscribe(roomId => {
      this.selectedRoomId = roomId;
      this.showOverlay = !!roomId;
      this.loadRoomEvents(roomId);
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      meeting_type: ['frontal', Validators.required],
      date: [null, Validators.required],
      startTime: ['', [
        Validators.required,
        Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
      ]],
      endTime: ['', [
        Validators.required,
        Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
      ]],
      place: [null],
      type: [null],
      patient_id: [this.data?.patient_id || null, Validators.required],
      notes: ['']
    });
  }

  loadRoomEvents(roomId: number | null) {
    if (!roomId) { this.roomEvents = []; return; }

    this.patientService.getAppointmentsByRoom(roomId).subscribe({
      next: appointments => {
        this.roomEvents = appointments
          .filter((a: any) => a.status !== 'בוטלה')
          .map((a: any) => ({
            id: a.appointment_id,
            title: (a as any).therapist_name || 'פגישה', // כאן נשתמש ב-any
            start: `${a.appointment_date}T${a.start_time}`,
            end: `${a.appointment_date}T${a.end_time}`
          }));
      },
      error: () => this.roomEvents = []
    });
  }

  onOverlayDateSelected(event: any) {
    this.showOverlay = false;
    if (event?.dateStr) {
      this.treatmentForm.patchValue({ date: event.dateStr.split('T')[0] });
    }

    const dialogRef = this.dialog.open(SelectTimeDialogComponent, {
      width: '350px',
      data: { roomEvents: this.roomEvents }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.treatmentForm.patchValue({
          startTime: result.startTime,
          endTime: result.endTime
        });
      }
    });
  }

  closeOverlay() { this.showOverlay = false; }

  getErrorMessage(field: string): string {
    const control = this.treatmentForm.get(field);
    return control ? this.errorHandler.getValidationErrorMessage(control, field) : '';
  }

  save() {
    if (this.treatmentForm.invalid) {
      this.treatmentForm.markAllAsTouched();
      return;
    }

    const value = this.treatmentForm.value;
    const appointment = {
      therapist_id: Number(localStorage.getItem('therapist_id')) || 1,
      patient_id: value.patient_id,
      treatment_type_id: value.type ? Number(value.type) : 0,
      room_id: value.meeting_type === 'frontal' && value.place ? Number(value.place) : (value.meeting_type === 'phone' ? undefined : 0),
      appointment_date: value.date,
      start_time: value.startTime,
      end_time: value.endTime,
      notes: value.notes || '',
      meeting_type: value.meeting_type
    };
    console.log('Prepared appointment object:', appointment);

    if (this.data && this.data.appointment_id) {
      console.log('Calling updateAppointment with:', this.data.appointment_id, appointment);
      this.patientService.updateAppointment(this.data.appointment_id, appointment).subscribe({
        next: res => {
          console.log('updateAppointment response:', res);
          const result = (res && 'data' in res) ? (res as any).data : null;
          this.appointmentAdded.emit(result || { ...appointment, appointment_id: this.data.appointment_id });
          this.dialogRef.close(result || { ...appointment, appointment_id: this.data.appointment_id });
        },
        error: err => {
          console.error('updateAppointment error:', err);
          alert('שגיאה בעדכון הפגישה');
        }
      });
    } else {
      console.log('Calling createAppointment with:', appointment);
      this.patientService.createAppointment(appointment).subscribe({
        next: res => {
          console.log('createAppointment response:', res);
          this.appointmentAdded.emit(res.data || appointment);
          this.dialogRef.close(res.data || appointment);
        },
        error: err => {
          console.error('createAppointment error:', err);
          alert('שגיאה בשמירת הפגישה');
        }
      });
    }
  }

  async close() {
    if (await this.canCloseDialog()) {
      this.dialogRef.close();
    }
  }

}
