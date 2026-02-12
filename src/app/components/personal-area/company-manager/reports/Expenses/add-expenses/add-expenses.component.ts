import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ExpenseCategory } from 'src/app/models/expenses.model';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.css', '../../../../../../styles/dialog-forms.css']
})
export class AddExpensesComponent {
  expenseForm: FormGroup;
  isSubmitting = false;
  categories: ExpenseCategory[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddExpensesComponent>,
    private fb: FormBuilder,
    private expensesService: ExpensesService
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required]],
      payment_date: ['', [Validators.required]],
      expense_category_id: ['', [Validators.required]],
      payment_method: ['other'],
      reference_number: [''],
      notes: ['']
    });
    // כאן אפשר לטעון קטגוריות אמיתיות מהשרת בעתיד
    this.categories = [];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.expenseForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const expense = {
        ...this.expenseForm.value,
        expense_id: 0 // backend assigns
      };
      this.expensesService.createExpense(expense).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding expense:', error);
        }
      });
    }
  }
}
