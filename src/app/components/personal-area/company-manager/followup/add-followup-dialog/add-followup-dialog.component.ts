import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FollowupService } from 'src/app/services/followup.service';

@Component({
  selector: 'app-add-followup-dialog',
  templateUrl: './add-followup-dialog.component.html',
  styleUrls: ['./add-followup-dialog.component.css',
    '../../../../../styles/dialog-forms.css'
  ]
})
export class AddFollowupDialogComponent {

  followupForm: FormGroup;
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<AddFollowupDialogComponent>,
    private fb: FormBuilder,
    private followupService: FollowupService,
  @Inject(MAT_DIALOG_DATA) public data: { person_id: number, created_by_person_id: number }
  ) {
    // בדיקה בקונסול שה-person_id מגיע
    console.log('AddFollowupDialogComponent - person_id:', this.data.person_id);
    if (typeof this.data.person_id === 'undefined') {
      alert('שגיאה: לא התקבל מזהה פרסון. לא ניתן להוסיף מעקב ללא מזהה פרסון.');
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    this.followupForm = this.fb.group({
      follow_date: [todayStr, Validators.required],
      follow_time: [''],
      remind: [false],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.followupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const newFollowup = {
        person_id: this.data.person_id,
        created_by_person_id: this.data.created_by_person_id,
        follow_date: this.followupForm.value.follow_date,
        follow_time: this.followupForm.value.follow_time, 
        remind: this.followupForm.value.remind,
        notes: this.followupForm.value.notes
      };

      this.followupService.addFollowup(newFollowup).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding followup:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.followupForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string, label: string): string {
    const control = this.followupForm.get(field);
    if (control?.errors?.['required']) {
      return `${label} הוא שדה חובה.`;
    }
    return '';
  }
}
