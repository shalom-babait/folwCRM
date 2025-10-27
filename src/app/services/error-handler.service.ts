import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  constructor(private snackBar: MatSnackBar) { }

  // טיפול בשגיאות כלליות
  handleError(message: string): void {
    this.snackBar.open(`שגיאה: ${message}`, 'סגור', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    console.error('Error:', message); // אופציונלי לרישום לקונסול
  }

  // טיפול בשגיאות API
  handleApiError(error: any): void {
    const message = error?.message || 'שגיאת שרת לא ידועה';
    this.handleError(message);
  }

  // טיפול בשגיאות טופס לפי שדה וסוג השגיאה
  handleValidationError(fieldName: string, errorKey: string, label?: string, errorValue?: any): void {
    const displayLabel = label || fieldName;
    let message = `${displayLabel} שגיאה`;
    if (errorKey === 'required') message = `${displayLabel} הוא שדה חובה`;
    if (errorKey === 'min') message = `${displayLabel} חייב להיות גדול מ-0`;
    if (errorKey === 'maxlength') message = `${displayLabel} לא יכול להיות יותר מ-${errorValue?.requiredLength || ''} תווים`;
    if (errorKey === 'pattern') message = `${displayLabel} לא תקין`;
    if (errorKey === 'email') message = `${displayLabel} אינו אימייל תקין`;
    if (errorKey === 'max') message = `${displayLabel} גדול מדי`;
    this.handleError(message);
  }

  // מחזירה הודעת שגיאה מתאימה לשדה הטופס (לשימוש בתצוגה)
  getValidationErrorMessage(control: AbstractControl, label: string): string {
    if (!control || !control.errors) return '';
    const errors = control.errors;
    if (errors['required']) return `${label} הוא שדה חובה`;
    if (errors['min']) return `${label} חייב להיות גדול מ-${errors['min'].min}`;
    if (errors['maxlength']) return `${label} לא יכול להיות יותר מ-${errors['maxlength'].requiredLength} תווים`;
    if (errors['pattern']) return `${label} לא תקין`;
    if (errors['email']) return `${label} אינו אימייל תקין`;
    if (errors['max']) return `${label} גדול מדי`;
    return `${label} שגיאה לא ידועה`;
  }
}
