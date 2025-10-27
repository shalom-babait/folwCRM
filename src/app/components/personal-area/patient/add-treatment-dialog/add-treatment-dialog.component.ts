import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
// import { TreatmentService } from 'src/app/services/treatment.service'; // לשימוש עתידי
// import { TreatmentData } from 'src/app/classes/treatment'; // לשימוש עתידי

@Component({
  selector: 'app-add-treatment-dialog',
  templateUrl: './add-treatment-dialog.component.html',
  styleUrls: ['./add-treatment-dialog.component.css'],
})
export class CreateTreatmentDialogComponent implements OnInit {
  treatmentForm!: FormGroup;
  places: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    public dialogRef: MatDialogRef<CreateTreatmentDialogComponent>,
    // private treatmentService: TreatmentService
  ) {}

  ngOnInit() {
    this.treatmentForm = this.fb.group({
      date: [null, Validators.required],
      startTime: ['', [Validators.required, Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d$/)]],
      place: [null, Validators.required],
      notes: ['', [Validators.maxLength(250)]]
    });

    this.places = [
      { id: 1, name: 'מרפאה ראשית' },
      { id: 2, name: 'סניף ירושלים' },
      { id: 3, name: 'סניף תל אביב' }
    ];
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