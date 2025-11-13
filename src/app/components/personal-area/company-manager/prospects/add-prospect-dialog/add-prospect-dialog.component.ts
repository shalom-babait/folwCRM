// add-prospect-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProspectService } from 'src/app/services/prospect.service';
import { Prospect } from 'src/app/models/Prospect.model';
@Component({
  selector: 'app-add-prospect-dialog',
  templateUrl: './add-prospect-dialog.component.html',
  styleUrls: ['./add-prospect-dialog.component.css'
    , '../../../../../styles/dialog-forms.css'
  ]
})
export class AddProspectDialogComponent implements OnInit {
  prospectForm!: FormGroup;
  isSubmitting = false;

  statusOptions = [
    { value: 'new', label: 'חדש' },
    { value: 'contacted', label: 'נוצר קשר' },
    { value: 'converted', label: 'הומר למטופל' },
    { value: 'not_relevant', label: 'לא רלוונטי' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProspectDialogComponent>,
    private prospectService: ProspectService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.prospectForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(15)]],
      last_name: ['', [Validators.required, Validators.maxLength(20)]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^05\d{8}$/),
        Validators.maxLength(10)
      ]],
      phone_alt: ['', [
        Validators.pattern(/^05\d{8}$/),
        Validators.maxLength(10)
      ]],
      email: ['', [Validators.email, Validators.maxLength(30)]],
      city: ['', [Validators.maxLength(15)]],
      referral_source: ['', [Validators.maxLength(50)]],
      reason_for_visit: ['', [Validators.maxLength(200)]],
      status: ['new', Validators.required],
      notes: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.prospectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string, fieldLabel: string): string {
    const field = this.prospectForm.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldLabel} הוא שדה חובה`;
    }
    
    if (field.errors['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `${fieldLabel} לא יכול להכיל יותר מ-${maxLength} תווים`;
    }
    
    if (field.errors['pattern']) {
      if (fieldName === 'phone' || fieldName === 'phone_alt') {
        return 'מספר טלפון לא תקין (נדרש פורמט: 05XXXXXXXX)';
      }
    }
    
    if (field.errors['email']) {
      return 'כתובת אימייל לא תקינה';
    }

    return 'שדה לא תקין';
  }

  onSubmit(): void {
    if (this.prospectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // יצירת אובייקט מסוג Prospect
      const prospectData: Prospect = { ...this.prospectForm.value };

      // ניקוי שדות ריקים (אופציונלי)
      Object.keys(prospectData).forEach(key => {
        if ((prospectData as any)[key] === '' || (prospectData as any)[key] === null) {
          delete (prospectData as any)[key];
        }
      });

      this.prospectService.createProspect(prospectData).subscribe({
        next: (response) => {
          console.log('Prospect created successfully:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error creating prospect:', error);
          this.isSubmitting = false;
          // הצגת הודעת שגיאה למשתמש
          alert('שגיאה ביצירת המתעניין. אנא נסה שוב.');
        }
      });
    } else {
      // סימון כל השדות כ-touched כדי להציג שגיאות
      Object.keys(this.prospectForm.controls).forEach(key => {
        this.prospectForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}