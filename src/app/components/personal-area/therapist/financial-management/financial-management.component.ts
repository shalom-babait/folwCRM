import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payments.service';
import { TherapistSessionService } from 'src/app/services/therapist-session.service';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { AddExpensesComponent } from '../../company-manager/reports/Expenses/add-expenses/add-expenses.component';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  method: string;
  details: string;
  category: string;
}

@Component({
  selector: 'app-financial-management',
  templateUrl: './financial-management.component.html',
  styleUrls: ['./financial-management.component.css']
})
export class FinancialManagementComponent implements OnInit {
  personId: number = 0;  // שימוש ב-person_id במקום therapist_id
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  totalIncome: number = 0;
  totalExpense: number = 0;
  balance: number = 0;
  
  filterType: 'all' | 'income' | 'expense' = 'all';
  
  months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  constructor(
    private paymentService: PaymentService,
    private therapistSessionService: TherapistSessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.getUserFromLocalStorage();
    this.personId = user?.person_id || user?.user?.person_id || 0;
    
    if (this.personId) {
      this.loadTransactions();
    }
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

  loadTransactions(): void {
    this.paymentService.getFinancialTransactionsByMonth(
      this.personId,
      this.selectedMonth,
      this.selectedYear
    ).subscribe({
      next: (data) => {
        this.transactions = data.transactions || [];
        this.totalIncome = data.summary?.totalIncome || 0;
        this.totalExpense = data.summary?.totalExpense || 0;
        this.balance = data.summary?.balance || 0;
        this.applyFilter();
      },
      error: (err) => {
        console.error('שגיאה בטעינת תנועות כספיות:', err);
      }
    });
  }

  applyFilter(): void {
    let filtered = this.transactions;

    // סינון לפי סוג
    if (this.filterType !== 'all') {
      filtered = filtered.filter(t => t.type === this.filterType);
    }

    this.filteredTransactions = filtered;
  }

  onFilterChange(type: 'all' | 'income' | 'expense'): void {
    this.filterType = type;
    this.applyFilter();
  }

  previousMonth(): void {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.loadTransactions();
  }

  nextMonth(): void {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.loadTransactions();
  }

  getMonthName(): string {
    return this.months[this.selectedMonth - 1];
  }

  getPaymentMethodLabel(method: string): string {
    const methodMap: any = {
      'cash': 'מזומן',
      'credit_card': 'כרטיס אשראי',
      'bank_transfer': 'העברה בנקאית',
      'check': 'צ\'ק',
      'other': 'אחר',
      'כרטיס אשראי': 'כרטיס אשראי',
      'העברה בנקאית': 'העברה בנקאית',
      'מזומן': 'מזומן'
    };
    return methodMap[method] || method;
  }

  editTransaction(transaction: Transaction): void {
    // פונקציונליות עריכה - תתווסף בשלב הבא
  }

  deleteTransaction(transaction: Transaction): void {
    // פונקציונליות מחיקה - תתווסף בשלב הבא
  }

  openAddIncomeDialog(): void {
    const dialogRef = this.dialog.open(AddPaymentComponent, {
      width: '500px',
      direction: 'rtl',
      panelClass: 'add-payment-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  openAddExpenseDialog(): void {
    const dialogRef = this.dialog.open(AddExpensesComponent, {
      width: '500px',
      direction: 'rtl',
      panelClass: 'add-expense-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }
}
