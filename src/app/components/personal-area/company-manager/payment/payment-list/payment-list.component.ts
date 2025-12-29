import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { PaymentService } from 'src/app/services/payments.service';
import { Payment } from 'src/app/models/payment.model';
import { ex } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  @Input() patientId!: number;
  sortOrder: 'asc' | 'desc' = 'asc'; // 'asc' למיון מהישן לחדש, 'desc' מהחדש לישן
  transactions: Payment[] = [];
  totalDebits = 0;
  totalCredits = 0;
  finalBalance = 0;
  filteredTransactions: Payment[] = [];
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
          return {
            pay_id: item.pay_id ?? item.id ?? item.payment_id,
            appointment_id: item.appointment_id,
            therapist_id: item.therapist_id,
            amount: Number(item.amount ?? 0),
            payment_date: item.payment_date ? new Date(item.payment_date) : undefined,
            method: item.method,
            transaction_type: item.transaction_type,
            status: item.status,
            person_id: item.person_id,
            // אפשר להוסיף כאן שדות נוספים אם צריך
          } as Payment;
        });

        // מיון לפי תאריך מהישן לחדש
        this.transactions.sort((a, b) => {
          return this.sortOrder === 'asc'
            ? (a.payment_date?.getTime() ?? 0) - (b.payment_date?.getTime() ?? 0)
            : (b.payment_date?.getTime() ?? 0) - (a.payment_date?.getTime() ?? 0);
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
      const dateMatch = this.dateFilter ? (transaction.payment_date ? transaction.payment_date >= new Date(this.dateFilter) : false) : true;
      const amountMatch = this.amountFilter ? (transaction.amount >= this.amountFilter) : true;
      return dateMatch && amountMatch;
    });
    this.calculateTotals(); // אם אתה רוצה לעדכן את הסכומים
  }

  recalculateBalances() {
    let runningBalance = 0;
    this.transactions = this.transactions.map(t => {
      if (t.transaction_type === 'debit') {
        runningBalance -= t.amount;
      } else if (t.transaction_type === 'credit') {
        runningBalance += t.amount;
      }
      return { ...t, balance: runningBalance };
    });
  }

  clearFilters() {
    this.dateFilter = null;
    this.amountFilter = null;
    this.applyFilters();
  }

  calculateTotals() {
    this.totalDebits = this.transactions
      .filter(t => (t as any).transaction_type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    this.totalCredits = this.transactions
      .filter(t => (t as any).transaction_type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    this.finalBalance = this.totalCredits - this.totalDebits;
  }


  deletePayment(payment: Payment) {
    if (!payment || !payment.pay_id) {
      alert('לא נמצא מזהה תשלום למחיקה');
      return;
    }
    if (confirm('האם אתה בטוח שברצונך למחוק את התשלום?')) {
      this.paymentService.deletePayment(payment.pay_id).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (err) => {
          alert('שגיאה במחיקת תשלום');
          console.error('שגיאה במחיקת תשלום:', err);
        }
      });
    }
  }

  showDetails(payment: Payment) {
    console.log('פרטי פעולה:', payment);
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
        patient_id: this.patientId,
        therapist_id: transaction.therapist_id
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
