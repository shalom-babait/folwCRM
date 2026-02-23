import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreatePatientProblemRating } from 'src/app/models/patient-problems';
import { UserStateService } from 'src/app/services/state/user-state.service';
import { PatientProblemsService } from 'src/app/services/patient-problems.service';

// ...השארת מחלקה אחת בלבד, כל השאר הוסר...
@Component({
  selector: 'app-add-patient-problem-rating',
  templateUrl: './add-patient-problem-rating.component.html',
  styleUrls: ['./add-patient-problem-rating.component.css',
    '../../../../../styles/dialog-forms.css'
  ]
})
export class AddPatientProblemRatingComponent implements OnInit {
  @Input() patient_problem_id!: number; // required for rating
  ratingForm!: FormGroup;
  isSubmitting = false;
  stars = Array(10).fill(0);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPatientProblemRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patient_problem_id: number; last_score?: number | null },
    private patientProblemsService: PatientProblemsService,
    private userStateService: UserStateService
  ) {
    this.patient_problem_id = data?.patient_problem_id;
  }

  ngOnInit(): void {
    this.ratingForm = this.fb.group({
      rating_date: [this.getToday(), Validators.required],
      score: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      notes: ['']
    });
  }

  getToday(): string {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }

  setScore(score: number): void {
    this.ratingForm.get('score')?.setValue(score);
  }

  onScoreInput(): void {
    // Optional: force update if needed
  }

  isFieldInvalid(field: string): boolean {
    const control = this.ratingForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(field: string, label: string): string {
    const control = this.ratingForm.get(field);
    if (!control) return '';
    if (control.hasError('required')) return `${label} הוא שדה חובה`;
    if (control.hasError('min')) return `${label} חייב להיות לפחות ${control.getError('min').min}`;
    if (control.hasError('max')) return `${label} חייב להיות עד ${control.getError('max').max}`;
    return '';
  }

  onSubmit(): void {
    if (this.ratingForm.invalid) return;
    this.isSubmitting = true;
    const formValue = this.ratingForm.value;
    // קבלת organization_id מהסטייט או localStorage
    let orgId = 1;
    const user = this.userStateService.getUser();
    if (user && user.user && user.user.organization_id) {
      orgId = user.user.organization_id;
    } else {
      orgId = Number(localStorage.getItem('organization_id')) || 1;
    }
    const rating: import('src/app/models/patient-problems').PatientProblemRating = {
      patient_problem_id: this.patient_problem_id,
      rating_date: formValue.rating_date,
      score: formValue.score,
      notes: formValue.notes,
      organization_id: orgId
    };
    console.log('נשלח לשרת דירוג:', rating);
    this.patientProblemsService.addProblemRating(rating).subscribe({
      next: (savedRating) => {
        this.isSubmitting = false;
        this.dialogRef.close(savedRating);
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('שמירת הדירוג נכשלה.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
