import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomsService } from 'src/app/services/rooms.service';
import { TypesService } from 'src/app/services/types.service';
import { PatientService } from 'src/app/services/patient.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Room } from 'src/app/models/room.model';
import { SelectTimeDialogComponent } from 'src/app/components/select-time-dialog/select-time-dialog.component';

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
          mode: data.mode || 'frontal',
          patient_id: data.patient_id || null
        });
      } else {
        this.treatmentForm.get('mode')?.setValue('frontal');
      }
    }

  ngOnInit(): void {
    this.treatmentForm.get('mode')?.valueChanges.subscribe(mode => {
      if (mode === 'phone') {
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
      room_id: value.mode === 'frontal' && value.place ? Number(value.place) : (value.mode === 'phone' ? undefined : 0),
      appointment_date: value.date,
      start_time: value.startTime,
      end_time: value.endTime,
      notes: value.notes || '',
      mode: value.mode
    };

    this.patientService.createAppointment(appointment).subscribe({
      next: res => {
        this.appointmentAdded.emit(res.data || appointment);
        this.dialogRef.close(res.data || appointment);
      },
      error: err => alert('שגיאה בשמירת הפגישה')
    });
  }

  close() { this.dialogRef.close(); }
  // add-treatment-dialog.component.ts
public editorInit: any = {
  language: 'he_IL',
  directionality: 'rtl',
  plugins: [
    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
    'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
  ],
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
  tinycomments_mode: 'embedded',
  tinycomments_author: 'Author name',
  mergetags_list: [
    { value: 'First.Name', title: 'First Name' },
    { value: 'Email', title: 'Email' },
  ],
  ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
  uploadcare_public_key: '659c9ed48d8ceb29727a',
  language_url: '/assets/tinymce/langs/he_IL.js'
};

}
