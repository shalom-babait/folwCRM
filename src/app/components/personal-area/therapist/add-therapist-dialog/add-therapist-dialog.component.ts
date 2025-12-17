import { SelectedDepartmentForSave } from 'src/app/models/department-group.model';
// add-therapist-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { TherapistCreationData } from 'src/app/models/therapist.model';
import { SelectedItem } from '../../../../models/department-group.model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MatDialogRef } from '@angular/material/dialog';
import { TherapistService } from 'src/app/services/therapist.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-therapist-dialog',
  templateUrl: './add-therapist-dialog.component.html',
  styleUrls: [
    '../../../../styles/dialog-forms.css'
      ]
})
export class AddTherapistDialogComponent implements OnInit {
  // בחירות מחלקות וקבוצות לשיוך למחלקות
  selectedDepartments: SelectedDepartmentForSave[] = [];

  // עדכון מחלקות נבחרות מהקומפוננטה הבת
  onDepartmentsSelected(selected: SelectedDepartmentForSave[]) {
    this.selectedDepartments = selected;
  }
  therapistForm: FormGroup;
  hidePassword = true;

  // בחירות מחלקות וקבוצות
  selectedItems: SelectedItem[] = [];
  initialSelections: SelectedItem[] = []; // למקרה של עריכה

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTherapistDialogComponent>,
    public errorHandler: ErrorHandlerService,
    private therapistService: TherapistService
  ) {
    this.therapistForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      teudat_zehut: ['', [Validators.pattern(/^[0-9]{9}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^05[0-9]{8}$/)]],
      city: ['', Validators.required],
      address: [''],
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      agree: [false, Validators.requiredTrue],
      gender: ['other', Validators.required],
      birth_date: ['']
    });
  }

  ngOnInit(): void {
    // אם יש נתונים להעמסה מראש (במקרה של עריכה)
    // this.initialSelections = [...];
  }

  // מטפל בשינויים מקומפוננטת הבחירה
  onSelectionsChanged(selections: SelectedItem[]): void {
    this.selectedItems = selections;
    console.log('Selected items updated:', this.selectedItems);
  }

  onSave(): void {
    if (this.therapistForm.valid) {
      const formValue = this.therapistForm.value;
      const user = {
        user_name: formValue.user_name.trim(),
        password: formValue.password,
        role: 'therapist' as 'therapist',
        agree: (formValue.agree ? 1 : 0) as 0 | 1
      };
      const person = {
        first_name: formValue.first_name.trim(),
        last_name: formValue.last_name.trim(),
        teudat_zehut: formValue.teudat_zehut?.trim() || undefined,
        phone: formValue.phone.trim(),
        city: formValue.city.trim(),
        address: formValue.address?.trim() || undefined,
        gender: formValue.gender,
        birth_date: formValue.birth_date,
        email: formValue.email?.trim() || undefined
      };
      const therapist = {};
      const therapistCreationData = {
        user,
        person,
        therapist,
        selectedDepartments: this.selectedDepartments
      };
      console.log('TherapistCreationData to send:', therapistCreationData);
      this.therapistService.createTherapist(therapistCreationData).subscribe({
        next: (res) => {
          console.log('מטפל חדש נוסף:', res);
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.error('שגיאה ביצירת מטפל:', err);
          alert('שגיאה בהוספת מטפל. אנא נסה שוב.');
        }
      });
    } else {
      Object.keys(this.therapistForm.controls).forEach(key => {
        this.therapistForm.get(key)?.markAsTouched();
      });
    }
  }


  // מחלץ מזהי מחלקות וקבוצות מהבחירות
  private extractDepartmentAndGroupIds(): { departmentIds: number[], groupIds: number[] } {
    const departmentIds: Set<number> = new Set();
    const groupIds: number[] = [];

    console.log('extractDepartmentAndGroupIds - selectedItems:', this.selectedItems);

    this.selectedItems.forEach(item => {
      if (item.type === 'department') {
        // אם נבחרה מחלקה שלמה
        if (item.department.department_id) {
          departmentIds.add(item.department.department_id);
        }
      } else if (item.type === 'group' && item.group) {
        // אם נבחרה קבוצה ספציפית
        if (item.group.group_id) {
          groupIds.push(item.group.group_id);
        }
        // גם להוסיף את המחלקה של הקבוצה
        if (item.department.department_id) {
          departmentIds.add(item.department.department_id);
        }
      }
    });


    return {
      departmentIds: Array.from(departmentIds),
      groupIds: groupIds
    };
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