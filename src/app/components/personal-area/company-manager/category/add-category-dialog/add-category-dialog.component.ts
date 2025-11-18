// add-category-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { CategoryFormData, CategoryType, Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: [
    './add-category-dialog.component.css',
    '../../../../../styles/dialog-forms.css'
  ]
})
export class AddCategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  isSaving = false;

  // אפשרויות לסוג הקטגוריה
  categoryTypes: { value: CategoryType; label: string }[] = [
    { value: 'prospect', label: 'מתעניין' },
    { value: 'patient', label: 'מטופל' },
    { value: 'employee', label: 'עובד' },
    { value: 'treatment', label: 'טיפול' }
  ];

  // אפשרויות אייקונים
  iconOptions: string[] = [
    'person',
    'group',
    'local_hospital',
    'medical_services',
    'favorite',
    'star',
    'flag',
    'label',
    'bookmark',
    'category',
    'tag',
    'emoji_events',
    'workspace_premium',
    'verified',
    'new_releases'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    public errorHandler: ErrorHandlerService,
    private categoryService: CategoryService
  ) {
this.categoryForm = this.fb.group({
  category_type: ['patient', Validators.required],
  category_name: ['', [
    Validators.required, 
    Validators.minLength(2), 
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-Zא-ת\s]+$/)
  ]],
  description: ['', Validators.maxLength(200)],
  color: ['', Validators.required],
  icon: [''],
  display_order: [0, [Validators.required, Validators.min(0)]],
  is_active: [true]
});
  }

  ngOnInit(): void {
    // אם יש צורך בהעמסת נתונים להתחלה
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      console.log('Form value:', formValue);

      const categoryData: CategoryFormData = {
        category_type: formValue.category_type,
        category_name: formValue.category_name.trim(),
        description: formValue.description?.trim() || undefined,
        color: formValue.color,
        icon: formValue.icon || undefined,
        display_order: Number(formValue.display_order) || 0,
        is_active: !!formValue.is_active
      };

        console.log('CategoryFormData to save:', categoryData);

        // Call API to create category and close dialog with created entity on success
        this.isSaving = true;
        this.categoryForm.disable();
        this.categoryService.createCategory(categoryData)
          .pipe(finalize(() => { this.isSaving = false; this.categoryForm.enable(); }))
          .subscribe({
            next: (created: Category) => {
              this.dialogRef.close(created);
            },
            error: (err) => {
              console.error('Failed to create category', err);
              this.errorHandler.handleApiError(err);
            }
          });
    } else {
      // סימון כל השדות כנגועים כדי להציג שגיאות
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getFieldError(fieldName: string, label: string): string {
    const control = this.categoryForm.get(fieldName);
    if (control && control.errors) {
      if (fieldName === 'category_name' && control.errors['pattern']) {
        return 'שם קטגוריה יכול להכיל רק אותיות (עברית/אנגלית) ורווחים';
      }
    }
    return control ? this.errorHandler.getValidationErrorMessage(control, label) : '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getColorPreview(): string {
    return this.categoryForm.get('color')?.value || '';
  }
}