// add-therapist-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { TherapistCreationData } from 'src/app/models/therapist.model';
import { SelectedItem } from '../../../../models/department-group.model';
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

  // בחירות מחלקות וקבוצות
  selectedItems: SelectedItem[] = [];
  initialSelections: SelectedItem[] = []; // למקרה של עריכה

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
    // בדיקה אם הטופס תקין
    if (this.therapistForm.valid) {
      const formValue = this.therapistForm.value;
      console.log('Form value:', formValue);

      // איסוף מחלקות וקבוצות מהבחירות
      console.log('Selected items before extract:', this.selectedItems);
      const selectedDepartments = this.buildSelectedDepartmentsForSave();
      console.log('SelectedDepartmentsForSave:', selectedDepartments);

      const therapistCreationData = {
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
          agree: formValue.agree ? 1 : 0,
          gender: formValue.gender,
          birth_date: formValue.birth_date
        },
        therapist: {
          specialization: formValue.specialization.trim(),
          experience_years: parseInt(formValue.experience_years, 10)
        },
        selectedDepartments
      };

      console.log('TherapistCreationData to save:', therapistCreationData);
      // שליחת נתוני יצירה
      this.dialogRef.close(therapistCreationData);
    }
    else {
      // סימון כל השדות כנגועים כדי להציג שגיאות
      Object.keys(this.therapistForm.controls).forEach(key => {
        this.therapistForm.get(key)?.markAsTouched();
      });
    }
  }

  // בניית מערך שיוכים למחלקות וקבוצות לשמירה
  private buildSelectedDepartmentsForSave(): Array<{ department_id: number; group_ids: number[] }> {
    const map = new Map<number, number[]>();
    this.selectedItems.forEach(item => {
      const depId = item.department.department_id!;
      if (!map.has(depId)) {
        map.set(depId, []);
      }
      if (item.type === 'group' && item.group?.group_id) {
        map.get(depId)!.push(item.group.group_id);
      }
    });
    return Array.from(map.entries()).map(([department_id, group_ids]) => ({ department_id, group_ids }));
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

    console.log('extractDepartmentAndGroupIds - departmentIds:', Array.from(departmentIds));
    console.log('extractDepartmentAndGroupIds - groupIds:', groupIds);

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