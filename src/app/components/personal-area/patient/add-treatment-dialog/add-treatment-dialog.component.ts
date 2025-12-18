import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectTimeDialogComponent } from 'src/app/components/select-time-dialog/select-time-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators ,AbstractControl} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
// import { TreatmentService } from 'src/app/services/treatment.service'; // לשימוש עתידי
// import { TreatmentData } from 'src/app/classes/treatment'; // לשימוש עתידי
import { RoomsService } from 'src/app/services/rooms.service';
import { TypesService } from 'src/app/services/types.service';
import { PatientService } from 'src/app/services/patient.service';
import { Room } from 'src/app/models/room.model';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { MatSnackBar } from '@angular/material/snack-bar';
//import { PatientService } from '../../../../services/patient.service';
//import { RoomsService } from 'src/app/services/rooms.service';
//import { TypesService } from 'src/app/services/types.service ';

@Component({
  selector: 'app-add-treatment-dialog',
  templateUrl: './add-treatment-dialog.component.html',
  styleUrls: ['./add-treatment-dialog.component.css']
})
export class CreateTreatmentDialogComponent implements OnInit {
  @Output() appointmentAdded = new EventEmitter<any>();
  treatmentForm!: FormGroup;
  rooms: Room[] = [];
  types: any[] = [];
  selectedRoomId: number | null = null;
  showCalendar: boolean = false;
  roomEvents: any[] = [];
  showOverlay: boolean = false;
  constructor(
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    public dialogRef: MatDialogRef<CreateTreatmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  private roomsService: RoomsService,
  private typesService: TypesService,
  private patientService: PatientService,
    private dialog: MatDialog
    // private treatmentService: TreatmentService
  ) {
  this.treatmentForm = this.createForm();
  // ברירת מחדל: טיפול פרונטלי
  this.treatmentForm.get('mode')?.setValue('frontal');
  }

  ngOnInit(): void {
    // אם מצב הטיפול משתנה לטלפוני, ננקה את שדה החדר
    this.treatmentForm.get('mode')?.valueChanges.subscribe(mode => {
      if (mode === 'phone') {
        this.treatmentForm.get('place')?.setValue(null);
      }
    });
    this.roomsService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      }
    });
    if (this.data && this.data.patient_id) {
      this.typesService.getTypes(this.data.patient_id).subscribe({
        next: (type) => {
          this.types = type;
        },
        error: (error) => {
          console.error('Error fetching rooms:', error);
        }
      });
    }
    if (this.data && this.data.initialData) {
      this.treatmentForm.patchValue(this.data.initialData);
    }
    this.treatmentForm.get('place')?.valueChanges.subscribe(roomId => {
      this.selectedRoomId = roomId;
      this.showCalendar = !!roomId;
      this.loadRoomEvents(roomId);
      // פתח overlay ליומן בכל בחירת חדר
      this.showOverlay = !!roomId;
    });
  }

  loadRoomEvents(roomId: number) {
    // טוען פגישות מהשרת לפי roomId וממיר לאירועים של FullCalendar
    if (!roomId) {
      this.roomEvents = [];
      return;
    }
  this.patientService.getAppointmentsByRoom(roomId).subscribe({
      next: (appointments) => {
        this.roomEvents = appointments
          .filter(app => app.status !== 'בוטלה')
          .map(app => {
            // המרת appointment_date מ-UTC לתאריך מקומי
            let localDateObj = new Date(app.appointment_date);
            const yyyy = localDateObj.getFullYear();
            const mm = String(localDateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(localDateObj.getDate()).padStart(2, '0');
            const localDate = `${yyyy}-${mm}-${dd}`;
            // בנה תאריך מלא בפורמט ISO תקני ל-FullCalendar
            const start = `${localDate}T${app.start_time}`;
            const end = `${localDate}T${app.end_time}`;
            // Prefer therapist_name from backend, fallback to therapist_id or 'פגישה'
            const therapistName = (app as any).therapist_name;
            return {
              id: app.appointment_id,
              title: therapistName ? therapistName : (app.therapist_id ? `פגישה של מטפל ${app.therapist_id}` : 'פגישה'),
              start,
              end,
              color: '#1a237e',
              allDay: false
            };
          });
      },
      error: (err) => {
        this.roomEvents = [];
      }
    });
  }

  onOverlayDateSelected(event: any) {
    // פותח דיאלוג לבחירת שעות לאחר בחירת תאריך ביומן הגדול
    this.showOverlay = false;
    if (event?.dateStr) {
      const dateObj = new Date(event.dateStr);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      this.treatmentForm.patchValue({ date: formattedDate });
    }
    const dialogRef = this.dialog.open(SelectTimeDialogComponent, {
      width: '350px',
      data: { date: event.dateStr, roomEvents: this.roomEvents }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedDate = this.treatmentForm.value.date || (event?.dateStr ? event.dateStr.split('T')[0] : null);
        const overlap = this.roomEvents.some(ev => {
          const evDate = ev.start.split('T')[0];
          if (evDate !== selectedDate) return false;
          const evStart = ev.start.split('T')[1];
          const evEnd = ev.end.split('T')[1];
          return (result.startTime < evEnd && result.endTime > evStart);
        });
        if (overlap) {
          alert('השעה שבחרת תפוסה בחדר זה. אנא בחר שעה אחרת.');
          return;
        }
        this.treatmentForm.patchValue({
          startTime: result.startTime,
          endTime: result.endTime
        });
      }
    });
  }

  closeOverlay() {
    this.showOverlay = false;
  }

  private createForm(): FormGroup {
    return this.fb.group({
      mode: ['frontal', Validators.required],
      date: [null, Validators.required],
      startTime: ['', [Validators.required, Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d$/)]],
      place: [null],
      type: [null],
      patient_id: [this.data?.patient_id || null, Validators.required],
      notes: ['', [Validators.maxLength(250)]]
    });
  }

  getFieldLabel(field: string): string {
    switch (field) {
      case 'date': return 'תאריך';
      case 'startTime': return 'שעת התחלה';
      case 'endTime': return 'שעת סיום';
      case 'place': return 'מקום';
      case 'notes': return 'הערות';
      default: return '';
    }
  }

getErrorMessage(field: string): string {
  const control = this.treatmentForm.get(field);
  if (!control) return '';
  return this.errorHandler.getValidationErrorMessage(control, this.getFieldLabel(field));
}
  async save() {
    if (this.treatmentForm.invalid) {
      Object.keys(this.treatmentForm.controls).forEach(field => {
        this.treatmentForm.get(field)?.markAsTouched();
      });
      return;
    }

    // בדיקת תפוסה לפני שמירה
    const formValue = this.treatmentForm.value;
    const newStart = formValue.startTime;
    const newEnd = formValue.endTime;
    const newDate = formValue.date;
    const roomId = formValue.place;
    // בדוק חפיפה רק אם מדובר בטיפול פרונטלי
    if (formValue.mode === 'frontal') {
      const overlap = this.roomEvents.some(ev => {
        // השווה תאריך
        const evDate = ev.start.split('T')[0];
        if (evDate !== newDate) return false;
        // השווה שעות
        const evStart = ev.start.split('T')[1];
        const evEnd = ev.end.split('T')[1];
        return (newStart < evEnd && newEnd > evStart);
      });
      if (overlap) {
        alert('השעה שבחרת תפוסה בחדר זה. אנא בחר שעה אחרת.');
        return;
      }
    }

    // תיקון פורמט שדות לפני שליחה לשרת
    let appointmentDate = formValue.date;
    if (appointmentDate && appointmentDate.includes('T')) {
      appointmentDate = appointmentDate.split('T')[0];
    }
    let startTime = formValue.startTime;
    let endTime = formValue.endTime;
    // הסר שניות אם קיימות
    if (startTime && startTime.length > 5) {
      startTime = startTime.substring(0,5);
    }
    if (endTime && endTime.length > 5) {
      endTime = endTime.substring(0,5);
    }
    // שליפת therapist_id מתוך localStorage
    const therapistIdStr = localStorage.getItem('therapist_id');
    const therapist_id = therapistIdStr ? Number(therapistIdStr) : (this.data?.therapist_id || 1);
    // Build appointment payload, omitting null/undefined fields
    let roomIdToSend = null;
    if (formValue.mode === 'frontal') {
      const selectedRoom = Number(formValue.place);
      roomIdToSend = selectedRoom && selectedRoom !== 0 ? selectedRoom : null;
    }
    const appointment: any = {
      therapist_id,
      patient_id: formValue.patient_id,
      treatment_type_id: Number(formValue.type) || 0, // תמיד מספר
      room_id: roomIdToSend,
      appointment_date: appointmentDate,
      start_time: startTime,
      end_time: endTime,
      notes: formValue.notes || '',
      mode: formValue.mode
    };
    // שלח פגישה לשרת

  console.log('Appointment payload:', appointment);
  this.patientService.createAppointment(appointment).subscribe({
      next: (response) => {
        if (response.success) {
          alert('הפגישה נוספה בהצלחה!');
          this.appointmentAdded.emit(response.data || appointment);
          this.dialogRef.close(response.data || appointment);
        } else {
          alert('אירעה שגיאה בשמירת הפגישה');
        }
      },
      error: (err) => {
        console.error('error from server:', err);
        alert('שגיאה בשמירת הפגישה: ' + (err?.message || ''));
      }
    });
  }

  close() {
    this.dialogRef.close();

  }
}