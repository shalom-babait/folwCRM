//o[src/app/components/add-patient-dialog/add-patient-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../../../services/patient.service';
import { Patient } from 'src/app/models/patient.model';import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-add-patient-dialog',
  templateUrl: './add-patient-dialog.component.html',
  styleUrls: ['./add-patient-dialog.component.css']
})
export class AddPatientDialogComponent implements OnInit {
  patientForm: FormGroup;
  isSubmitting = false;
  maxDate = new Date();

  genderOptions = [
    { value: 'זכר', label: 'זכר' },
    { value: 'נקבה', label: 'נקבה' },
    ];

  statusOptions = [
    { value: 'פעיל', label: 'פעיל' },
    { value: 'לא פעיל', label: 'לא פעיל' },
    { value: 'בהמתנה', label: 'בהמתנה' }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddPatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService 
  ) {
    this.patientForm = this.createForm();
  }

  ngOnInit(): void {

  }

  private createForm(): FormGroup {
    return this.fb.group({
      user_id: ['', [Validators.required, Validators.min(1)]],
      therapist_id: [''],
      birth_date: [''],
      gender: [''],
      status: ['פעיל', Validators.required],
      history_notes: ['', [Validators.maxLength(500)]]
    });
  }

  // // Getter לקבלת שדות הטופס בקלות
  // get f(): { [key: string]: AbstractControl } {
  //   return this.patientForm.controls;
  // }

  //מהאינפוטים ומפעילה את הסרויס לטיפול שגיאות פונקציה לקבלת הודעות שגיאה
  getErrorMessage(fieldName: string): string {
    const field = this.patientForm.get(fieldName);
    if (!field) return '';
    const errors = field.errors;
    if (!errors) return '';
    for (const errorKey in errors) {
      this.errorHandler.handleValidationError(fieldName, errorKey, this.getFieldLabel(fieldName), errors[errorKey]);
      break;
    }
    return '';
  }

// במקום שיהיה באנגלית יהיה בעברית- פונקציה לקבלת תוויות שדות
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'user_id': 'מזהה משתמש',
      'therapist_id': 'מזהה מטפל',
      'birth_date': 'תאריך לידה',
      'gender': 'מין',
      'status': 'סטטוס',
      'history_notes': 'הערות היסטוריה'
    };
    return labels[fieldName] || fieldName;
  }


  onSubmit(): void {
    if (this.patientForm.valid) {
      this.isSubmitting = true;

      // וודא שיש user_id ושהוא תקין
      const userId = this.patientForm.value.user_id;
      if (!userId || userId <= 0) {
        this.errorHandler.handleError('מזהה משתמש חייב להיות מספר חיובי');
        this.isSubmitting = false;
        return;
      }

      // יצירת אובייקט מסוג CreatePatientRequest
      const patientData = {
        user_id: userId,
        therapist_id: this.patientForm.value.therapist_id || undefined,
        birth_date: this.patientForm.value.birth_date ?
          new Date(this.patientForm.value.birth_date).toISOString().split('T')[0] :
          undefined,
        gender: this.patientForm.value.gender || undefined,
        status: this.patientForm.value.status || 'פעיל',
        history_notes: this.patientForm.value.history_notes || undefined
      };

      this.patientService.createPatient(patientData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.snackBar.open('המטופל נוסף בהצלחה!', 'סגור', {
              duration: 3000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.dialogRef.close(response.data);
          } else {
            this.errorHandler.handleError(response.message || 'שגיאה לא ידועה');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorHandler.handleApiError(error);
        }
      });
    } else {
      // סמן את כל השדות כנגעו כדי להציג שגיאות
      Object.keys(this.patientForm.controls).forEach(key => {
        const control = this.patientForm.get(key);
        control?.markAsTouched();
      });

      this.errorHandler.handleError('אנא תקן את השגיאות בטופס');
    }
  }
  
  // פונקציית handleError נמחקה – משתמשים ב-ErrorHandlerService

  onCancel(): void {
    this.dialogRef.close();
  }

  // פונקציה לניקוי הטופס
  onReset(): void {
    this.patientForm.reset();
    this.patientForm.patchValue({
      status: 'פעיל' 
    });
  }
}