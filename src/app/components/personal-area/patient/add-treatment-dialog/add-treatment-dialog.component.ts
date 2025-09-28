<<<<<<< HEAD:src/app/components/personal-area/patient/add-treatment-dialog/add-treatment-dialog.component.ts
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
=======

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../../../services/patient.service';
import { RoomsService } from 'src/app/services/rooms.service';

interface Place {
  room_id: number;
  room_name: string;
}
interface Type {
  id: number;
  name: string;
}
interface AppointmentData {
  therapist_id: number;
  patient_id: number;
  type_id: number;
  room_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status?: string;
  notes?: string;
}
>>>>>>> 4cb490cad5595bfaabf37c0530c200aa2bda469f:src/app/components/personal-area/patient/create-treatment-dialog/add-treatment-dialog.component.ts

@Component({
  selector: 'app-add-treatment-dialog',
  templateUrl: './add-treatment-dialog.component.html',
<<<<<<< HEAD:src/app/components/personal-area/patient/add-treatment-dialog/add-treatment-dialog.component.ts
  styleUrls: ['./add-treatment-dialog.component.css'],
})
export class CreateTreatmentDialogComponent implements OnInit {
  treatmentForm!: FormGroup;
  places: any[] = []; // כאן נטען את המקומות מה־DB

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.treatmentForm = this.fb.group({
      date: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      place: [null, Validators.required],
      notes: ['']   // שדה חדש להערות
    });
  
    this.places = [
      { id: 1, name: 'מרפאה ראשית' },
      { id: 2, name: 'סניף ירושלים' },
      { id: 3, name: 'סניף תל אביב' }
    ];
  }
  

  save() {
    if (this.treatmentForm.valid) {
      console.log(this.treatmentForm.value);
      // פה תקראי לפונקציה ששולחת לשרת ושומרת ב־DB
    }
  }
  close()
  {
    
  }
}
=======
  styleUrls: ['./add-treatment-dialog.component.css']
})

export class CreateTreatmentDialogComponent implements OnInit {
  treatmentForm!: FormGroup;
  isSubmitting = false;
  // maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // שנה קדימה
  // minDate = new Date(); // מהיום

  places: Place[] = [];
  types: Type[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: PatientService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateTreatmentDialogComponent>,
        private roomsService: RoomsService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.treatmentForm = this.createForm();
  }

  ngOnInit(): void {
        this.roomsService.getRooms().subscribe({
      next: (rooms) => {
        this.places = rooms;
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      }
    });
  
    this.loadTypes();
    // אם יש נתונים ראשוניים, נכניס אותם לטופס
    if (this.data && this.data.initialData) {
      this.treatmentForm.patchValue(this.data.initialData);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      date: [null, Validators.required],
      startTime: ['', [Validators.required, this.timeValidator]],
      endTime: ['', [Validators.required, this.timeValidator]],
      place: [null, Validators.required],
      type: [null, Validators.required],
      notes: ['', [Validators.maxLength(500)]]
    }, { validators: this.timeRangeValidator });
  }

  // Getter לקבלת שדות הטופס בקלות
  get f(): { [key: string]: AbstractControl } {
    return this.treatmentForm.controls;
  }

  // וולידטור לפורמט זמן
  private timeValidator(control: AbstractControl): { [key: string]: any } | null {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (control.value && !timeRegex.test(control.value)) {
      return { 'invalidTime': true };
    }
    return null;
  }

  // וולידטור לבדיקה שזמן סיום אחרי זמן התחלה
  private timeRangeValidator(form: AbstractControl): { [key: string]: any } | null {
    const startTime = form.get('startTime')?.value;
    const endTime = form.get('endTime')?.value;

    if (startTime && endTime && startTime >= endTime) {
      return { 'timeRangeInvalid': true };
    }
    return null;
  }


  private loadTypes(): void {
    // כאן תקראי לשירות שטוען את החדרים מהשרת
    // לעת עתה נשתמש בנתונים קבועים
    this.types = [
      { id: 1, name: 'ריגשי' },
      { id: 2, name: 'זוגי' },
      { id: 3, name: 'יעוץ' }
    ];
  }
  // פונקציה לקבלת הודעות שגיאה
  getErrorMessage(fieldName: string): string {
    const field = this.treatmentForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} הוא שדה חובה`;
    }

    if (field?.hasError('invalidTime')) {
      return `${this.getFieldLabel(fieldName)} חייב להיות בפורמט HH:MM`;
    }

    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} לא יכול להיות יותר מ-${maxLength} תווים`;
    }

    // שגיאות ברמת הטופס
    if (this.treatmentForm.hasError('timeRangeInvalid')) {
      return 'שעת הסיום חייבת להיות אחרי שעת ההתחלה';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'date': 'תאריך',
      'startTime': 'שעת התחלה',
      'endTime': 'שעת סיום',
      'place': 'מקום',
      'type': 'סוג טיפול',
      'notes': 'הערות'
    };
    return labels[fieldName] || fieldName;
  }

  // שגיאת טווח זמנים
  get hasTimeRangeError(): boolean {
    return this.treatmentForm.hasError('timeRangeInvalid') &&
      this.f['startTime'].touched &&
      this.f['endTime'].touched;
  }

  save(): void {
    if (this.treatmentForm.valid) {
      this.isSubmitting = true;

      // הכנת הנתונים לשליחה לשרת
      const appointmentData: AppointmentData = {
        therapist_id: 1, 
        patient_id: 2,     
        type_id: this.treatmentForm.value.type,     
        room_id: this.treatmentForm.value.place,
        appointment_date: this.formatDate(this.treatmentForm.value.date),
        start_time: this.treatmentForm.value.startTime + ':00', // הוספת שניות
        end_time: this.treatmentForm.value.endTime + ':00',     // הוספת שניות
        status: 'מתוזמנת',
        notes: this.treatmentForm.value.notes || undefined
      };
      console.log({ appointmentData });

      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.snackBar.open('הטיפול נקבע בהצלחה!', 'סגור', {
              duration: 3000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.dialogRef.close(response.data);
          } else {
            this.handleError(response.message || 'שגיאה לא ידועה');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.handleError(error.message || 'שגיאה בתקשורת עם השרת');
        }
      });
    } else {
      // סמן את כל השדות כנגעו כדי להציג שגיאות
      Object.keys(this.treatmentForm.controls).forEach(key => {
        const control = this.treatmentForm.get(key);
        control?.markAsTouched();
      });

      this.snackBar.open('אנא תקן את השגיאות בטופס', 'סגור', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // פורמט YYYY-MM-DD
  }

  private handleError(message: string): void {
    this.snackBar.open(`שגיאה: ${message}`, 'סגור', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // פונקציה לניקוי הטופס
  onReset(): void {
    this.treatmentForm.reset();
    // אפשר להוסיף ערכי ברירת מחדל אם רוצים
  }
}
>>>>>>> 4cb490cad5595bfaabf37c0530c200aa2bda469f:src/app/components/personal-area/patient/create-treatment-dialog/add-treatment-dialog.component.ts
