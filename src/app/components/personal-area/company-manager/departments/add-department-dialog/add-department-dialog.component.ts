import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-department-dialog',
  templateUrl: './add-department-dialog.component.html',
  styleUrls: ['./add-department-dialog.component.css']
})
export class AddDepartmentDialogComponent {
  departmentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      treatmentType: ['', Validators.required],
      targetAudience: ['', Validators.required],
      manager: [''],
      therapists: [''],
      status: ['active', Validators.required],
      notes: ['']
    });
  }

  onSave() {
    if (this.departmentForm.valid) {
      console.log('Department Data:', this.departmentForm.value);
      // כאן אפשר להוסיף קריאה לשרת
    }
  }

  onCancel() {
    // סגירת הדיאלוג או איפוס הטופס
    this.departmentForm.reset();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.departmentForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string, label: string): string {
    const control = this.departmentForm.get(field);
    if (control?.errors?.['required']) {
      return `${label} הוא שדה חובה.`;
    }
    return '';
  }
}
