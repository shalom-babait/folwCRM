import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense, ExpenseCategory } from 'src/app/models/expenses.model';
import { AddExpensesComponent } from '../add-expenses/add-expenses.component';

@Component({
  selector: 'app-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.css',
    '../../../../../../styles/shared-table.css']
})
export class ExpensesTableComponent implements OnInit {
  expenses: Expense[] = [];
  categories: ExpenseCategory[] = [];
  searchTerm: string = '';

  constructor(
    private expensesService: ExpensesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.loadCategories();
  }

  loadExpenses(): void {
    this.expensesService.getAllExpenses().subscribe(data => {
      this.expenses = data;
    });
  }

  loadCategories(): void {
    // יש להוסיף קריאה לקטגוריות הוצאה מהשרת בעתיד
    // כרגע דמה
    this.categories = [];
  }

  get filteredExpenses(): Expense[] {
    if (!this.searchTerm.trim()) return this.expenses;
    const term = this.searchTerm.trim().toLowerCase();
    return this.expenses.filter(e =>
      e.payment_date.includes(term) ||
      e.amount.toString().includes(term) ||
      this.getCategoryName(e.expense_category_id).includes(term)
    );
  }

  getCategoryName(categoryId: number): string {
    const cat = this.categories.find(c => c.expense_category_id === categoryId);
    return cat ? cat.category_name : '';
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'cash': return 'מזומן';
      case 'credit_card': return 'אשראי';
      case 'bank_transfer': return 'העברה בנקאית';
      case 'check': return 'צ׳ק';
      case 'other': return 'אחר';
      default: return method;
    }
  }

  openCreateExpenseDialog(): void {
    const dialogRef = this.dialog.open(AddExpensesComponent, {
      width: '500px',
      direction: 'rtl',
      panelClass: 'add-expense-dialog',
      data: { categories: this.categories }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadExpenses();
    });
  }

  editExpense(e: Expense): void {
    // יש להוסיף דיאלוג עריכת הוצאה
  }

  deleteExpense(id: number): void {
    this.expensesService.deleteExpense(id).subscribe(() => {
      this.expenses = this.expenses.filter(x => x.expense_id !== id);
    });
  }
}
