import { Component, OnInit } from '@angular/core';
import { TherapistCreationData } from 'src/app/models/therapist.model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-therapist-dialog',
  templateUrl: './add-therapist-dialog.component.html',
  styleUrls: ['./add-therapist-dialog.component.css']
})
export class AddTherapistDialogComponent implements OnInit {
  therapistForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTherapistDialogComponent>,
    public errorHandler: ErrorHandlerService
  ) {
    this.therapistForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      teudat_zehut: ['', [Validators.pattern(/^\d{9}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^05\d{8}$/)]],
      city: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      specialization: ['', Validators.required],
      experience_years: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      agree: [false, Validators.requiredTrue]
        ,
        gender: ['other', Validators.required],
        birth_date: ['']
    });
  }

  ngOnInit(): void {
    // אפשר להוסיף לוגיקה נוספת בעת טעינת הקומפוננטה
  }

  onSave(): void {
    alert('שמירת מטפל חדש');
    // בדיקה אם הטופס תקין
    if (this.therapistForm.valid) {
      const formValue = this.therapistForm.value;
      
      const therapistCreationData: TherapistCreationData = {
        user: {
          first_name: formValue.first_name.trim(),
          last_name: formValue.last_name.trim(),
          teudat_zehut: formValue.teudat_zehut?.trim() || undefined,
          email: formValue.email.trim(),
          password: formValue.password,
          phone: formValue.phone.trim(),
          city: formValue.city.trim(),
          address: formValue.address?.trim() || undefined,
          role: 'therapist',
          agree: formValue.agree ? 1 : 0 ,
          gender: formValue.gender,
          birth_date: formValue.birth_date
        },
        therapist: {
          specialization: formValue.specialization.trim(),
          experience_years: parseInt(formValue.experience_years, 10)
        }
      };
      // שליחת נתוני יצירה בלבד (לא נתוני הצגה)
      alert('שמירת מטפל חדש: ' + JSON.stringify(therapistCreationData));
      this.dialogRef.close(therapistCreationData);
    } else {
      // סימון כל השדות כנגועים כדי להציג שגיאות
      Object.keys(this.therapistForm.controls).forEach(key => {
        this.therapistForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
 getFieldError(fieldName: string, label: string): string {
    const control = this.therapistForm.get(fieldName);
    return control ? this.errorHandler.getValidationErrorMessage(control, label) : '';
  }
  // פונקציה עזר לבדיקה אם שדה מסוים לא תקין
  isFieldInvalid(fieldName: string): boolean {
    const field = this.therapistForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

}