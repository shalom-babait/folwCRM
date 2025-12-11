import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { PaymentService } from 'src/app/services/payments.service';

interface Transaction {
  date: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  @Input() patientId!: number;
  sortOrder: 'asc' | 'desc' = 'asc'; // 'asc' למיון מהישן לחדש, 'desc' מהחדש לישן
  transactions: Transaction[] = [];
  totalDebits = 0;
  totalCredits = 0;
  finalBalance = 0;
  filteredTransactions: Transaction[] = [];
  dateFilter: string | null = null;
  amountFilter: number | null = null;
  constructor(private dialog: MatDialog, private paymentService: PaymentService) { }

  ngOnInit() {
    if (this.patientId) {
      this.loadTransactions();
    }
  }

  loadTransactions() {
    this.paymentService.getPaymentsByPatientId(this.patientId).subscribe({
      next: (data) => {
        console.log('Transactions from server:', data);

        let runningBalance = 0;

        this.transactions = data.map((item: any) => {
          const amount = Number(item.amount ?? 0);
          const isCharge = item.transaction_type === 'debit';

          const debit = isCharge ? amount : 0;
          const credit = !isCharge ? amount : 0;

          runningBalance += debit - credit;

          const description = `${item.method || ''} ${item.status || ''}`.trim();

          return {
            date: new Date(item.payment_date),
            description,
            debit,
            credit,
            balance: runningBalance
          } as Transaction;
        });

        // מיון לפי תאריך מהישן לחדש
        this.transactions.sort((a, b) => {
          return this.sortOrder === 'asc'
            ? a.date.getTime() - b.date.getTime()
            : b.date.getTime() - a.date.getTime();
        });
        this.recalculateBalances();

        this.calculateTotals();
        this.applyFilters();
      },
      error: (err) => {
        console.error('שגיאה בטעינת תשלומים:', err);
      }
    });
  }
  getSortTooltip(): string {
    return this.sortOrder === 'asc' ? 'החלף למיון מהחדש לישן' : 'החלף למיון מהישן לחדש';
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadTransactions(); // טען מחדש את התשלומים כדי להחיל את המיון החדש
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const dateMatch = this.dateFilter ? transaction.date >= new Date(this.dateFilter) : true;
      const amountMatch = this.amountFilter ? (transaction.debit >= this.amountFilter || transaction.credit >= this.amountFilter) : true;
      return dateMatch && amountMatch;
    });
    this.calculateTotals(); // אם אתה רוצה לעדכן את הסכומים
  }

  recalculateBalances() {
    let runningBalance = 0;

    this.transactions = this.transactions.map(t => {
      runningBalance += t.debit - t.credit;
      return { ...t, balance: runningBalance };
    });
  }

  clearFilters() {
    this.dateFilter = null;
    this.amountFilter = null;
    this.applyFilters();
  }

  calculateTotals() {
    this.totalDebits = this.transactions.reduce((sum, t) => sum + t.debit, 0);
    this.totalCredits = this.transactions.reduce((sum, t) => sum + t.credit, 0);
    this.finalBalance = this.totalDebits - this.totalCredits;
  }

  assignPayment(transaction: Transaction) {
    console.log('שיוך תשלום:', transaction);
  }

  showDetails(transaction: Transaction) {
    console.log('פרטי פעולה:', transaction);
  }
  openAddTransaction(): void {
    const dialogRef = this.dialog.open(AddTransactionComponent, {
      width: '500px',
      direction: 'rtl',
      data: { patient_id: this.patientId }
    });

    dialogRef.componentInstance.transactionAdded.subscribe((transaction) => {
      console.log("Patient ID in transactionAdded:", this.patientId);

      const methodMap: any = {
        cash: 'מזומן',
        transfer: 'העברה בנקאית',
        card: 'כרטיס אשראי'
      };

      const statusMap: any = {
        pending: 'pending',
        paid: 'paid',
        failed: 'failed',
        refunded: 'refunded'
      };

      const payload = {
        appointment_id: transaction.transaction_type === 'debit' ? transaction.appointment_id : null,
        amount: transaction.amount,
        payment_date: transaction.payment_date,
        method: methodMap[transaction.method] ?? 'מזומן',
        status: statusMap[transaction.status] ?? 'pending',
        transaction_type: transaction.transaction_type,
        patient_id: this.patientId
      };



      this.paymentService.createPayment(payload).subscribe({
        next: () => {
          console.log("נשמר בהצלחה");
          this.loadTransactions();
          dialogRef.close();
        },
        error: (err) => console.error("שגיאה בשמירה:", err)
      });
    });


    dialogRef.componentInstance.cancelled.subscribe(() => {
      dialogRef.close();
    });
  }


  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('he-IL');
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return 'balance-positive';
    if (balance < 0) return 'balance-negative';
    return 'balance-zero';
  }
}
