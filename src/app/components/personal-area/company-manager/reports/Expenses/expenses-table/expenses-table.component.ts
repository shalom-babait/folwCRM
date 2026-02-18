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
  selectedCategoryId: string | number = '';
  showAddCategoryInput: boolean = false;
  newCategoryName: string = '';

  constructor(
    private expensesService: ExpensesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.loadCategories();
  }

  ngOnChanges(): void {
    if (this.selectedCategoryId === 'add-category') {
      this.openAddCategoryDialog();
      this.selectedCategoryId = '';
    }
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

  openAddCategoryDialog(): void {
    // יש להוסיף דיאלוג הוספת קטגוריה חדשה
    alert('הוספת קטגוריה חדשה');
  }

  onCategorySelect(): void {
    if (this.selectedCategoryId === 'add-category') {
      this.showAddCategoryInput = true;
      this.selectedCategoryId = '';
    }
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    // כאן אפשר להוסיף קריאה לשרת להוספת קטגוריה
    this.categories.push({
      expense_category_id: Date.now(), // מזהה זמני
      organization_id: 1,
      category_name: this.newCategoryName,
      is_active: true,
      created_at: ''
    });
    this.newCategoryName = '';
    this.showAddCategoryInput = false;
  }

  get filteredExpenses(): Expense[] {
    let filtered = this.expenses;
    if (this.selectedCategoryId !== '' && this.selectedCategoryId !== undefined && this.selectedCategoryId !== 'add-category') {
      filtered = filtered.filter(e => e.expense_category_id == this.selectedCategoryId);
    }
    if (!this.searchTerm.trim()) return filtered;
    const term = this.searchTerm.trim().toLowerCase();
    return filtered.filter(e =>
      e.payment_date.includes(term) ||
      e.amount.toString().includes(term) ||
      this.getCategoryName(e.expense_category_id, e.other_category_name).includes(term)
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
}
