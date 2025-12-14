import { PaymentService } from 'src/app/services/payments.service';
import { Component, EventEmitter, Output, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DebitTransaction {
  transaction_type: 'debit';
  appointment_id: null | string | number;
  amount: number;
  payment_date: string;   // <-- STRING
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  method: 'cash' | 'transfer' | 'card';
}

interface CreditTransaction {
  appointment_id?: string;
  transaction_type: 'credit';
  amount: number;
  payment_date: string;   // <-- STRING
  method: 'cash' | 'transfer' | 'card';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
}

type Transaction = DebitTransaction | CreditTransaction;

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  @Output() transactionAdded = new EventEmitter<Transaction>();
  @Output() cancelled = new EventEmitter<void>();

  patientId!: number;
  appointments: any[] = [];

  transactionType: 'debit' | 'credit' = 'debit';

  constructor(private paymentService: PaymentService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.patientId = this.data.patient_id;
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
    this.resetForms();
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
    let transaction: Transaction;

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
        method: 'cash'
      };

    } else {

      if (!this.validateCreditForm()) return;

      transaction = {
        transaction_type: 'credit',
        amount: this.creditForm.amount,
        payment_date: this.creditForm.payment_date,  // <-- STRING
        method: this.creditForm.method,
        status: this.creditForm.status
      };
    }

    this.transactionAdded.emit(transaction);
    this.resetForms();
  }

  onCancel() {
    this.cancelled.emit();
    this.resetForms();
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
