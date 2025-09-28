//o[src/app/components/add-patient-dialog/add-patient-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService, Patient } from '../../../../services/patient.service';

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
    { value: 'אחר', label: 'אחר' }
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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.patientForm = this.createForm();
  }

  ngOnInit(): void {
    // אם יש נתונים ראשוניים, נכניס אותם לטופס
    if (this.data && this.data.initialData) {
      this.patientForm.patchValue(this.data.initialData);
    }
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

  // Getter לקבלת שדות הטופס בקלות
  get f(): { [key: string]: AbstractControl } {
    return this.patientForm.controls;
  }

  // פונקציה לקבלת הודעות שגיאה
  getErrorMessage(fieldName: string): string {
    const field = this.patientForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} הוא שדה חובה`;
    }

    if (field?.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} חייב להיות גדול מ-0`;
    }

    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} לא יכול להיות יותר מ-${maxLength} תווים`;
    }

    return '';
  }

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
        this.handleError('מזהה משתמש חייב להיות מספר חיובי');
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
            this.handleError(response.message || 'שגיאה לא ידועה');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.handleError(error.message);
        }
      });
    } else {
      // סמן את כל השדות כנגעו כדי להציג שגיאות
      Object.keys(this.patientForm.controls).forEach(key => {
        const control = this.patientForm.get(key);
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
    this.patientForm.reset();
    this.patientForm.patchValue({
      status: 'פעיל' // ערך ברירת מחדל
    });
  }
}