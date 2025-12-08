
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
  onDepartmentsSelected(selected: SelectedDepartmentForSave[]) {
    this.selectedDepartments = selected ? [...selected] : [];
  }

  // פונקציה עזר לבניית אובייקט PatientCreationData
  private buildPatientCreationData(formValue: any, user_id: number, selectedDepartments: SelectedDepartmentForSave[]): PatientCreationData {
  // Ensure birth_date is always yyyy-mm-dd or undefined
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

    // Ensure gender is always in English
    const gender = ['male', 'female', 'other'].includes(formValue.gender) ? formValue.gender : 'other';
    return {
      person: {
        person_id: undefined,
        first_name: formValue.first_name.trim(),
        last_name: formValue.last_name.trim(),
        teudat_zehut: formValue.teudat_zehut?.trim() || undefined,
        phone: formValue.phone.trim(),
        city: formValue.city.trim(),
        address: formValue.address?.trim() || undefined,
        birth_date: birthDate,
        gender: gender,
      },
      patient: {
        patient_id: undefined,
        user_id: user_id,
        therapist_id: therapist_id,
        status: formValue.status || 'פעיל',
        history_notes: formValue.history_notes?.trim() || undefined,
      },
      user:{
        user_id: user_id,
        email: formValue.email.trim(),
        role: 'patient',
        agree: 0,
        created_at: new Date().toISOString()
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
      birth_date: [''],
      gender: ['male', Validators.required],
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
    if (fieldName === 'history_notes' && control?.errors?.['maxlength']) {
      return `${label} לא יכול להיות ארוך מ-500 תווים.`;
    }
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
      // console.log('PatientCreationData to send:', patientCreationData);
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
            const person = response.data.person || response.data;
            const patient = response.data.patient || response.data;
            const patientCreationData: PatientCreationData = {
              person: {
                person_id: person.person_id,
                first_name: person.first_name,
                last_name: person.last_name,
                teudat_zehut: person.teudat_zehut,
                phone: person.phone,
                city: person.city,
                address: person.address,
                birth_date: person.birth_date,
                gender: person.gender,
              },
              patient: {
                patient_id: patient.patient_id,
                user_id: patient.user_id,
                therapist_id: patient.therapist_id,
                status: patient.status,
                history_notes: patient.history_notes,
              },
              user:{
                user_id: user_id,
                email: formValue.email.trim(),
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