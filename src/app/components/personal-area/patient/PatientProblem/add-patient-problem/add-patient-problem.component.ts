import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientProblem } from 'src/app/models/patient-problems';
import { PatientProblemsService } from 'src/app/services/patient-problems.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-patient-problem',
  templateUrl: './add-patient-problem.component.html',
  styleUrls: [
    './add-patient-problem.component.css',
    '../../../../../styles/dialog-forms.css'
  ]
})
export class AddPatientProblemComponent {
  problemForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private patientProblemsService: PatientProblemsService,
    private dialogRef: MatDialogRef<AddPatientProblemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patientId: number }
  ) {
    this.problemForm = this.fb.group({
      title: ['', Validators.required],
      status: ['active', Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.problemForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.problemForm.value;
      const patient_id = this.data?.patientId;
      const dataToSend = {
        title: formValue.title,
        status: formValue.status,
        notes: formValue.notes,
        patient_id
      };
      console.log('נתונים שנשלחים לשרת:', dataToSend);
      this.patientProblemsService.addPatientProblem(dataToSend as any).subscribe({
        next: (savedProblem) => {
          this.isSubmitting = false;
          this.dialogRef.close(savedProblem);
        },
        error: (err) => {
          this.isSubmitting = false;
          alert('שמירת הבעיה נכשלה.');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.problemForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string, label: string): string {
    const control = this.problemForm.get(field);
    if (control?.errors?.['required']) {
      return `${label} הוא שדה חובה.`;
    }
    if (control?.errors?.['min'] || control?.errors?.['max']) {
      return `${label} חייב להיות בין 1 ל-10.`;
    }
    return '';
  }
}
