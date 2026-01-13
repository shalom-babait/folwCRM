
import { Component, EventEmitter, Output, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payments.service';
import { DebitTransaction, CreditTransaction, Transaction } from 'src/app/models/payment.model';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {
  @Output() transactionUpdated = new EventEmitter<Transaction>();
  @Output() transactionAdded = new EventEmitter<Transaction>();
  @Output() cancelled = new EventEmitter<void>();

  patientId!: number;
  appointments: any[] = [];
  mode: 'add' | 'edit' = 'add';
  editingPaymentId?: number;

  transactionType: 'debit' | 'credit' = 'debit';

  constructor(private paymentService: PaymentService, @Inject(MAT_DIALOG_DATA) public data: any) { }
private toDateInputValue(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

  ngOnInit() {
    this.patientId = this.data.patient_id;

    if (this.data?.mode === 'edit' && this.data?.transaction) {
      this.mode = 'edit';

      const t = this.data.transaction;
      this.editingPaymentId = t.pay_id;
      this.transactionType = t.transaction_type;

      if (t.transaction_type === 'debit') {
        this.debitForm = {
          appointment_id: t.appointment_id,
          amount: t.amount,
          payment_date: this.toDateInputValue(t.payment_date)
        };
      } else {
        this.creditForm = {
          amount: t.amount,
          payment_date: this.toDateInputValue(t.payment_date),
          method: t.method,
          status: t.status
        };
      }
    }

    this.loadAppointments();
  }



  loadAppointments() {
    this.paymentService.getAppointments(this.patientId)
      .subscribe((data: any[]) => this.appointments = data);
  }

  // תאריך של היום בפורמט YYYY-MM-DD
  getToday(): string {
    return new Date().toISOString().substring(0, 10);
  }

  // טופס חוב
  debitForm = {
    appointment_id: '',
    amount: 0,
    payment_date: this.getToday()
  };

  // טופס תשלום
  creditForm = {
    amount: 0,
    payment_date: this.getToday(),
    method: 'cash' as 'cash' | 'transfer' | 'card',
    status: 'paid' as 'pending' | 'paid' | 'failed'
  };

  onTransactionTypeChange() {
    if (this.mode === 'add') {
      this.resetForms();
    } else if (this.mode === 'edit') {
      // בעריכה, העתק את הנתונים בין הטופסים כדי לשמור על הערכים
      if (this.transactionType === 'debit') {
        this.debitForm.payment_date = this.creditForm.payment_date;
        this.debitForm.amount = this.creditForm.amount;
      } else {
        this.creditForm.payment_date = this.debitForm.payment_date;
        this.creditForm.amount = this.debitForm.amount;
      }
    }
  }


  resetForms() {
    this.debitForm = {
      appointment_id: '',
      amount: 0,
      payment_date: this.getToday()
    };

    this.creditForm = {
      amount: 0,
      payment_date: this.getToday(),
      method: 'cash',
      status: 'paid'
    };
  }

  validateDebitForm(): boolean {
    return this.debitForm.amount > 0;
  }

  validateCreditForm(): boolean {
    return this.creditForm.amount > 0 && !!this.creditForm.payment_date;
  }


  onSubmit() {
    let transaction: Transaction & { therapist_id?: number };
    const therapistId = Number(localStorage.getItem('therapist_id')); // Declare therapistId once

    if (this.transactionType === 'debit') {
      if (!this.validateDebitForm()) return;
      transaction = {
        transaction_type: 'debit',
        appointment_id: this.debitForm.appointment_id
          ? Number(this.debitForm.appointment_id)
          : null,
        amount: this.debitForm.amount,
        payment_date: this.debitForm.payment_date,  // <-- STRING
        status: 'pending',
        method: 'cash',
        therapist_id: therapistId // Use therapistId from the top declaration
      };
    } else {
      if (!this.validateCreditForm()) return;
      transaction = {
        transaction_type: 'credit',
        amount: this.creditForm.amount,
        payment_date: this.creditForm.payment_date,  // <-- STRING
        method: this.creditForm.method,
        status: this.creditForm.status,
        therapist_id: therapistId // Use therapistId from the top declaration
      };
    }
    // ודא שמזהה המטפל נשלח תמיד
    if (therapistId) {
      (transaction as any).therapist_id = therapistId;
    }
    (transaction as any).pay_id = this.editingPaymentId;

    if (this.mode === 'edit') {
      this.transactionUpdated.emit(transaction);
    } else {
      this.transactionAdded.emit(transaction);
    }

    this.resetForms();

  }

  onCancel() {
    this.cancelled.emit();
    // this.resetForms();
  }
  paymentMethods = [
    { value: 'cash', label: 'מזומן' },
    { value: 'transfer', label: 'העברה בנקאית' },
    { value: 'card', label: 'כרטיס אשראי' }
  ];

  paymentStatuses = [
    { value: 'pending', label: 'ממתין' },
    { value: 'paid', label: 'אושר' },
    { value: 'failed', label: 'נכשל' },
    { value: 'refunded', label: 'הוחזר' }
  ];
}
