import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators ,AbstractControl} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
// import { TreatmentService } from 'src/app/services/treatment.service'; // לשימוש עתידי
// import { TreatmentData } from 'src/app/classes/treatment'; // לשימוש עתידי
import { RoomsService } from 'src/app/services/rooms.service';
import { TypesService } from 'src/app/services/types.service';
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
  treatmentForm!: FormGroup;
  rooms: Room[] = [];
  types: any[] = [];
  constructor(
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    public dialogRef: MatDialogRef<CreateTreatmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomsService: RoomsService,
    private typesService: TypesService
    // private treatmentService: TreatmentService
  ) {
    this.treatmentForm = this.createForm();
  }

  ngOnInit(): void {
this.roomsService.getRooms().subscribe({
  next: (rooms) => {
    this.rooms = rooms;
  },
  error: (error) => {
    console.error('Error fetching rooms:', error);
  }
});
    this.typesService.getTypes().subscribe({
      next: (type) => {
        this.types = type;
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      }
    });
    // this.loadTypes();
    // אם יש נתונים ראשוניים, נכניס אותם לטופס
    if (this.data && this.data.initialData) {
      this.treatmentForm.patchValue(this.data.initialData);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      date: [null, Validators.required],
      startTime: ['', [Validators.required, Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d$/)]],
      place: [null, Validators.required],
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
    // שמירה לשרת (דוגמה)
    // try {
    //   await this.treatmentService.addTreatment(this.treatmentForm.value as TreatmentData);
    //   this.dialogRef.close(true);
    // } catch (error) {
    //   this.errorHandler.handleServerError(error);
    // }
    this.dialogRef.close(this.treatmentForm.value); // דוגמה לסגירה עם ערך
  }

  close() {
    this.dialogRef.close();

  }
}