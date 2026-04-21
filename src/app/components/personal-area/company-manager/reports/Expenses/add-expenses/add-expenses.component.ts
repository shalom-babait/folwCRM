import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ExpenseCategory } from 'src/app/models/expenses.model';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.css', '../../../../../../styles/dialog-forms.css']
})
export class AddExpensesComponent implements OnInit {
  expenseForm: FormGroup;
  isSubmitting = false;
  categories: ExpenseCategory[] = [];
  showOtherCategory: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddExpensesComponent>,
    private fb: FormBuilder,
    private expensesService: ExpensesService
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required]],
      payment_date: [this.getTodayDate(), [Validators.required]],
      expense_category_id: ['', [Validators.required]],
      other_category_name: [''],
      payment_method: ['other'],
      reference_number: [''],
      notes: ['']
    });

    // מאזין לשינוי בקטגוריה
    this.expenseForm.get('expense_category_id')?.valueChanges.subscribe(val => {
      if (val === 'other') {
        this.showOtherCategory = true;
        this.expenseForm.get('other_category_name')?.setValidators([Validators.required]);
        this.expenseForm.get('other_category_name')?.updateValueAndValidity();
      } else {
        this.showOtherCategory = false;
        this.expenseForm.get('other_category_name')?.setValue('');
        this.expenseForm.get('other_category_name')?.clearValidators();
        this.expenseForm.get('other_category_name')?.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.expensesService.getExpenseCategories().subscribe({
      next: (categories: ExpenseCategory[]) => {
        this.categories = categories;
      },
      error: (err: any) => {
        console.error('Error loading categories:', err);
        this.categories = [];
      }
    });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getOrganizationId(): number | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.organization_id || null;
  }

  getUserFromLocalStorage(): any {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('שגיאה בקריאת נתוני משתמש:', error);
      return null;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.expenseForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const user = this.getUserFromLocalStorage();
      if (!user) {
        alert('לא נמצאו פרטי משתמש. אנא התחבר מחדש.');
        this.isSubmitting = false;
        return;
      }

      let expense: any = {
        ...this.expenseForm.value,
        expense_id: 0,
        organization_id: user.organization_id || user.user?.organization_id,
        person_id: user.person_id || user.user?.person_id
      };
      
      if (expense.expense_category_id === 'other') {
        expense.expense_category_id = null;
      } else {
        expense.other_category_name = null;
      }

      this.expensesService.createExpense(expense).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding expense:', error);
          alert('שגיאה בהוספת הוצאה. אנא נסה שוב.');
        }
      });
    }
  }
}
