
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../../../services/patient.service';
import { CreatePatientRequest, PatientCreationData } from 'src/app/models/patient.model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SelectedDepartmentForSave } from 'src/app/models/department-group.model';

@Component({
  selector: 'app-add-patient-dialog',
  templateUrl: './add-patient-dialog.component.html',
  styleUrls: [
    '../../../../styles/dialog-forms.css'
  ]
})
export class AddPatientDialogComponent implements OnInit {
  selectedDepartments: SelectedDepartmentForSave[] = [];

  // קריאה מהקומפוננטה של דפרטמנט סלקטור
  onDepartmentsSelected(selected: SelectedDepartmentForSave[] = []) {
    this.selectedDepartments = selected || [];
  }

  // פונקציה עזר לבניית אובייקט PatientCreationData
  private buildPatientCreationData(formValue: any, user_id: number, selectedDepartments: SelectedDepartmentForSave[]): PatientCreationData {
    const birthDate = formValue.birth_date ? new Date(formValue.birth_date).toISOString().split('T')[0] : undefined;
    let therapist_id: number | null = null;
    try {
      const therapistStr = localStorage.getItem('therapist');
      if (therapistStr) {
        const therapistObj = JSON.parse(therapistStr);
        if (therapistObj && therapistObj.therapist_id) {
          therapist_id = therapistObj.therapist_id;
        }
      }
    } catch (e) {
      therapist_id = null;
    }

    return {
      user: {
        user_id: user_id,
        first_name: formValue.first_name.trim(),
        last_name: formValue.last_name.trim(),
        teudat_zehut: formValue.teudat_zehut?.trim() || undefined,
        phone: formValue.phone.trim(),
        city: formValue.city.trim(),
        address: formValue.address?.trim() || undefined,
        email: formValue.email.trim(),
        birth_date: birthDate,
        gender: formValue.gender,
      },
      patient: {
        patient_id: undefined,
        user_id: user_id,
        therapist_id: therapist_id,
        birth_date: birthDate,
        gender: formValue.gender,
        status: formValue.status || 'פעיל',
        history_notes: formValue.history_notes?.trim() || undefined,
      },
      selectedDepartments: selectedDepartments
    };
  }
  patientForm: FormGroup;
  isSubmitting = false;
  maxDate = new Date().toISOString().split('T')[0];

  genderOptions = [
    { value: 'male', label: 'זכר' },
    { value: 'female', label: 'נקבה' },
    { value: 'other', label: 'אחר' }
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
    public errorHandler: ErrorHandlerService
  ) {
    this.patientForm = this.createForm();
  }

  ngOnInit(): void {
    // אתחול נוסף במידת הצורך
  }

  private createForm(): FormGroup {
    return this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      teudat_zehut: ['', [Validators.pattern(/^\d{9}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^05\d{8}$/)]],
      city: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      therapist_id: [''],
      birth_date: [''],
      gender: ['other', Validators.required],
      status: ['פעיל', Validators.required],
      history_notes: ['', [Validators.maxLength(500)]]
    });
  }

  // Getter לקבלת שדות הטופס בקלות
  get f(): { [key: string]: AbstractControl } {
    return this.patientForm.controls;
  }

  // פונקציה לקבלת הודעת שגיאה לשדה
  getFieldError(fieldName: string, label: string): string {
    const control = this.patientForm.get(fieldName);
    return control ? this.errorHandler.getValidationErrorMessage(control, label) : '';
  }

  // פונקציה עזר לבדיקה אם שדה מסוים לא תקין
  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.isSubmitting = true;
      const formValue = this.patientForm.value;
      const user_id = this.data?.user_id ?? 0;
      const patientCreationData: PatientCreationData = this.buildPatientCreationData(formValue, user_id, this.selectedDepartments);
      console.log('PatientCreationData to send:', patientCreationData);
      this.patientService.createPatient(patientCreationData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success && response.data) {
            this.snackBar.open('המטופל נוסף בהצלחה!', 'סגור', {
              duration: 3000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            // בניית אובייקט PatientCreationData מלא מהשרת, כולל מחלקות נבחרות
            const user = (response.data as any).user || response.data.user || response.data;
            const patient = response.data.patient || response.data;
            const patientCreationData: PatientCreationData = {
              user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                teudat_zehut: user.teudat_zehut,
                phone: user.phone,
                city: user.city,
                address: user.address,
                email: user.email,
                birth_date: user.birth_date,
                gender: user.gender,
              },
              patient: {
                patient_id: patient.patient_id,
                user_id: user.user_id,
                therapist_id: patient.therapist_id,
                birth_date: patient.birth_date,
                gender: patient.gender,
                status: patient.status,
                history_notes: patient.history_notes,
              },
              selectedDepartments: this.selectedDepartments
            };
            this.dialogRef.close(patientCreationData);
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

  onCancel(): void {
    this.dialogRef.close();
  }
}