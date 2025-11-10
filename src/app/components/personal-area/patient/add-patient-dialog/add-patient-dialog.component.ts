//o[src/app/components/add-patient-dialog/add-patient-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../../../services/patient.service';
import { CreatePatientRequest } from 'src/app/models/patient.model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

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
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      teudat_zehut: [''],
      phone: [''],
      city: [''],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
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

      // איסוף כל הנתונים מהטופס (משתמש ומטופל)
      const formValue = this.patientForm.value;
      // עיבוד תאריך לידה לפורמט YYYY-MM-DD
      const birthDate = formValue.birth_date ? new Date(formValue.birth_date).toISOString().split('T')[0] : undefined;
      const patientData = {
        // שדות משתמש
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        teudat_zehut: formValue.teudat_zehut,
        phone: formValue.phone,
        city: formValue.city,
        address: formValue.address,
        email: formValue.email,
        // שדות מטופל
        therapist_id: formValue.therapist_id || undefined,
        birth_date: birthDate,
        gender: formValue.gender || undefined,
        status: formValue.status || 'פעיל',
        history_notes: formValue.history_notes || undefined,
        user_id: this.data?.user_id // ודא שיש לך user_id ב-data
      };

      this.patientService.createPatient(patientData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success && response.data) {
            this.snackBar.open('המטופל נוסף בהצלחה!', 'סגור', {
              duration: 3000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            // בניית אובייקט מטופל מלא לשימוש ברשימה
            const user = (response.data as any).user || response.data;
            const patient = {
              patient_id: response.data.patient.patient_id,
              therapist_id: response.data.patient.therapist_id,
              birth_date: response.data.user.birth_date,
              gender: response.data.user.gender,
              // status: response.data.user.status,
              // history_notes: response.data.user.history_notes,
              user_id: response.data.user.user_id,
              first_name: user.first_name,
              last_name: user.last_name,
              teudat_zehut: user.teudat_zehut,
              phone: user.phone,
              city: user.city,
              address: user.address,
              email: user.email
            };
            this.dialogRef.close(patient);
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