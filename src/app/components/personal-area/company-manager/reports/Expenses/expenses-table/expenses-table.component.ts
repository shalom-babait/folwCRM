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
    this.expensesService.getAllExpenses().subscribe((res: any) => {
      const expenses = Array.isArray(res) ? res : (res && res.data ? res.data : []);
      this.expenses = (expenses || []).map((e: any) => ({ ...e, amount: +e.amount }));
      console.log('Expenses loaded:', this.expenses);
    }, error => {
      console.error('Error loading expenses:', error);
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

  getCategoryName(categoryId: number | null, otherCategoryName?: string | null): string {
    if ((categoryId === null || categoryId === undefined) && otherCategoryName) return otherCategoryName;
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

  selectedIds = new Set<number>();

toggleSelection(id: number | undefined): void {
  if (id == null) return;
  this.selectedIds.has(id)
    ? this.selectedIds.delete(id)
    : this.selectedIds.add(id);
}

isSelected(id: number | undefined): boolean {
  return id != null && this.selectedIds.has(id);
}

toggleAll(): void {
  if (this.isAllSelected()) {
    this.selectedIds.clear();
  } else {
    this.filteredExpenses.forEach(e => {
      if (e.expense_id != null) {
        this.selectedIds.add(e.expense_id);
      }
    });
  }
}

isAllSelected(): boolean {
  return (
    this.filteredExpenses.length > 0 &&
    this.filteredExpenses.every(e =>
      e.expense_id != null &&
      this.selectedIds.has(e.expense_id)
    )
  );
}

}
