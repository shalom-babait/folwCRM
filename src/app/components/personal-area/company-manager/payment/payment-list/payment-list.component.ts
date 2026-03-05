import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { PaymentService } from 'src/app/services/payments.service';
import { Payment } from 'src/app/models/payment.model';
import { ex } from '@fullcalendar/core/internal-common';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  @Input() patient!: PatientCreationData;
  @Input() therapistId?: number;
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
    if (this.patient && this.patient.person && this.patient.person.person_id) {
      this.loadTransactions();
    }
  }

  loadTransactions() {
    this.paymentService.getPaymentsByPatientId(this.patient.patient.patient_id || 0).subscribe({
      next: (data) => {
        this.transactions = data.map((item: any) => {
          return {
            payment_id: item.payment_id ?? item.id ?? item.payment_id,
            appointment_id: item.appointment_id,
            therapist_id: item.therapist_id,
            amount: Number(item.amount ?? 0),
            payment_date: item.payment_date ? new Date(item.payment_date) : undefined,
            method: item.method,
            transaction_type: item.transaction_type,
            status: item.status,
            person_id: item.person_id,
          } as Payment;
        });

        // מיון לפי תאריך מהישן לחדש
        this.transactions.sort((a, b) => {
          const aDate = typeof a.payment_date === 'string' ? new Date(a.payment_date) : a.payment_date;
          const bDate = typeof b.payment_date === 'string' ? new Date(b.payment_date) : b.payment_date;
          return this.sortOrder === 'asc'
            ? ((aDate && bDate) ? aDate.getTime() - bDate.getTime() : 0)
            : ((aDate && bDate) ? bDate.getTime() - aDate.getTime() : 0);
        });
        this.transactions = this.recalculateBalances(this.transactions);
        this.filteredTransactions = [...this.transactions];

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
    let list = [...this.transactions];

    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      list = list.filter(t => {
        const tDate = typeof t.payment_date === 'string' ? new Date(t.payment_date) : t.payment_date;
        return tDate ? tDate >= filterDate : false;
      });
    }

    if (this.amountFilter) {
      list = list.filter(t => t.amount >= this.amountFilter!);
    }

    this.filteredTransactions = this.recalculateBalances(list);
    this.calculateTotals();
  }

  recalculateBalances(list: Payment[]) {
    let runningBalance = 0;
    return list.map(t => {
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
    if (!payment || !payment.payment_id) {
      alert('לא נמצא מזהה תשלום למחיקה');
      return;
    }
    if (confirm('האם אתה בטוח שברצונך למחוק את התשלום?')) {
      this.paymentService.deletePayment(payment.payment_id).subscribe({
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

  showDetails(payment: Payment): void {
    const dialogRef = this.dialog.open(AddTransactionComponent, {
      width: '500px',
      direction: 'rtl',
      data: {
        mode: 'edit',
        person_id: this.patient.person.person_id,
        therapistId: this.therapistId,
        transaction: { ...payment }
      }
    });    
    dialogRef.componentInstance.transactionUpdated.subscribe((updatedPayment: Payment) => {
      const methodMap: any = {
        cash: 'מזומן',
        transfer: 'העברה בנקאית',
        card: 'כרטיס אשראי'
      };

      const payload = {
        amount: updatedPayment.amount,
        payment_date: updatedPayment.payment_date,
        method: methodMap[updatedPayment.method] ?? updatedPayment.method,
        transaction_type: updatedPayment.transaction_type,
        status: updatedPayment.status,
        therapist_id: updatedPayment.therapist_id,
        appointment_id: updatedPayment.appointment_id,
      };

      this.paymentService
        .updatePayment(updatedPayment.payment_id!, payload)
        .subscribe({
          next: () => this.loadTransactions(),
          error: err => console.error('שגיאה בעדכון תשלום', err)
        });

      dialogRef.close();
    });

    dialogRef.componentInstance.cancelled.subscribe(() => {
      dialogRef.close();
    });
  }

  openAddTransaction(): void {
    const dialogRef = this.dialog.open(AddTransactionComponent, {
      width: '500px',
      direction: 'rtl',
      data: { person_id: this.patient.person.person_id, therapistId: this.therapistId }
    });

    dialogRef.componentInstance.transactionAdded.subscribe(() => {
      this.loadTransactions();
      dialogRef.close();
    });


    dialogRef.componentInstance.cancelled.subscribe(() => {
      dialogRef.close();
    });
  }


  formatDate(date: string | Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return 'balance-positive';
    if (balance < 0) return 'balance-negative';
    return 'balance-zero';
  }
}
