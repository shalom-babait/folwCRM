import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FollowupService } from 'src/app/services/followup.service';
import { FollowUp } from 'src/app/models/followup.model';
import { Person } from 'src/app/models/person.model';

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
  isEdit: boolean = false;
  followupData?: FollowUp;

  constructor(
    public dialogRef: MatDialogRef<AddFollowupDialogComponent>,
    private fb: FormBuilder,
    private followupService: FollowupService,
    @Inject(MAT_DIALOG_DATA) public data: { followUp?: FollowUp, person?: Person, person_id?: number, created_by_person_id?: number }
  ) {
    this.isEdit = !!data.followUp;
    this.followupData = data.followUp;
    this.followupForm = this.fb.group({
      follow_date: [
        this.isEdit && this.followupData?.follow_date
          ? this.formatDateForInput(this.followupData.follow_date)
          : this.getTodayStr(),
        Validators.required
      ],
      follow_time: [this.isEdit ? this.followupData?.follow_time : ''],
      remind: [this.isEdit ? this.followupData?.remind : true],
      status: [this.isEdit ? this.followupData?.status : 'open'],
      notes: [this.isEdit ? this.followupData?.notes : '']
    });

  }

  /**
   * ממיר תאריך לפורמט yyyy-MM-dd עבור input[type=date]
   */
  formatDateForInput(date: string): string {
    if (!date) return '';
    // אם כבר בפורמט הנכון
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    // נסה להמיר מ-YYYY-MM-DD HH:mm:ss או תאריך JS
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  getTodayStr(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onSubmit(): void {
    if (this.followupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.followupForm.value;
      // פונקציה לעיצוב תאריך ל-YYYY-MM-DD
      const formatDate = (date: any): string =>
        date ? new Date(date).toISOString().slice(0, 10) : '';

      const formatDateTime = (date: any): string => {
        if (!date) return '';
        const d = new Date(date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
      };

      if (this.data.followUp && this.data.followUp.followup_id) {
        const updatedFollowup = {
          ...this.data.followUp,
          follow_date: formatDate(formValue.follow_date),
          follow_time: formValue.follow_time,
          remind: formValue.remind,
          notes: formValue.notes,
          created_at: formatDateTime(this.data.followUp.created_at || new Date())
        };
        this.followupService.updateFollowup(updatedFollowup).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error updating followup:', error);
          }
        });
      } else {
        // הוספה חדשה
        const person_id = Number(this.data.person?.person_id ?? this.data.person_id);
        const created_by_person_id = Number(this.data.followUp?.created_by_person_id ?? this.data.created_by_person_id);
        const newFollowup = {
          person_id,
          created_by_person_id,
          follow_date: formatDate(formValue.follow_date),
          follow_time: formValue.follow_time,
          remind: formValue.remind,
          status: formValue.status,
          notes: formValue.notes,
          created_at: formatDateTime(new Date())
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
