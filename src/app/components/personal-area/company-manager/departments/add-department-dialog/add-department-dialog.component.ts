import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/services/department.service';
@Component({
  selector: 'app-add-department-dialog',
  templateUrl: './add-department-dialog.component.html',
  styleUrls: ['./add-department-dialog.component.css'
    , '../../../../../styles/dialog-forms.css'
  ]
})
export class AddDepartmentDialogComponent {
  departmentForm: FormGroup;
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<AddDepartmentDialogComponent>,
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {

    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      treatmentType: ['', Validators.required],
      // targetAudience: ['', Validators.required],
      manager: [''],
      therapists: [''],
      status: ['active', Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.departmentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const newDepartment = {
        department_name: this.departmentForm.value.name
      };

      this.departmentService.addDepartment(newDepartment).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding department:', error);
        }
      });
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
