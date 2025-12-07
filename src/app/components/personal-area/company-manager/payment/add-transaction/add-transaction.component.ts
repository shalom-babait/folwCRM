import { Component, EventEmitter, Output } from '@angular/core';

interface DebitTransaction {
  transaction_type: 'debit';
  appointment_id: string;
  amount: number;
  // description: string;
  payment_date: Date;
  status: 'pending' | 'completed' | 'failed';
  method: 'cash' | 'transfer' | 'card';

}

interface CreditTransaction {
  appointment_id?: string;
  transaction_type: 'credit';
  amount: number;
  payment_date: Date;
  method: 'cash' | 'transfer' | 'card';
  status: 'pending' | 'completed' | 'failed';
  // transaction_type?: string;
  // reference?: string;
  // installments?: number;
}

type Transaction = DebitTransaction | CreditTransaction;

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent {
  @Output() transactionAdded = new EventEmitter<Transaction>();
  @Output() cancelled = new EventEmitter<void>();

  transactionType: 'debit' | 'credit' = 'debit';

  // טופס חוב
  debitForm = {
    appointment_id: '',
    amount: 0,
    // description: '',
    date: new Date()
  };

  // טופס תשלום
  creditForm = {
    amount: 0,
    payment_date: new Date(),
    method: 'cash' as 'cash' | 'transfer' | 'card',
    status: 'completed' as 'pending' | 'completed' | 'failed',
    // reference: '',
    // installments: 1
  };

  // רשימת תורים לדוגמה
  appointments = [
    { id: 'apt_001', description: 'טיפול שורש - 15/01/2025', patient: 'משה כהן' },
    { id: 'apt_002', description: 'ניקוי אבנית - 18/01/2025', patient: 'שרה לוי' },
    { id: 'apt_003', description: 'כתר קרמי - 20/01/2025', patient: 'דוד ישראלי' }
  ];

  paymentMethods = [
    { value: 'cash', label: 'מזומן' },
    { value: 'transfer', label: 'העברה בנקאית' },
    { value: 'card', label: 'כרטיס אשראי' }
  ];

  paymentStatuses = [
    { value: 'pending', label: 'ממתין' },
    { value: 'completed', label: 'אושר' },
    { value: 'failed', label: 'נכשל' }
  ];

  onTransactionTypeChange() {
    this.resetForms();
  }

  resetForms() {
    this.debitForm = {
      appointment_id: '',
      amount: 0,
      // description: '',
      date: new Date()
    };

    this.creditForm = {
      amount: 0,
      payment_date: new Date(),
      method: 'cash',
      status: 'completed',
      // reference: '',
      // installments: 1
    };
  }

  // onAppointmentChange() {
  //   const selectedAppointment = this.appointments.find(a => a.id === this.debitForm.appointment_id);
  //   if (selectedAppointment) {
  //     this.debitForm.description = selectedAppointment.description;
  //   }
  // }

  validateDebitForm(): boolean {
    if (!this.debitForm.appointment_id) return false;
    if (this.debitForm.amount <= 0) return false;
    // if (!this.debitForm.description.trim()) return false;
    return true;
  }

  validateCreditForm(): boolean {
    if (this.creditForm.amount <= 0) return false;
    if (!this.creditForm.payment_date) return false;
    return true;
  }

  onSubmit() {

    let transaction: Transaction;
    if (this.transactionType === 'debit') {
      if (!this.validateDebitForm()) return;
      transaction = {
        transaction_type: 'debit',
        appointment_id: this.debitForm.appointment_id,
        amount: this.debitForm.amount,
        // description: this.debitForm.description,
        payment_date: this.debitForm.date,
        status: 'pending',
        method: 'cash'
      };
    } else {
      if (!this.validateCreditForm()) return;

      transaction = {
        transaction_type: 'credit',
        amount: this.creditForm.amount,
        payment_date: this.creditForm.payment_date,
        method: this.creditForm.method,
        status: this.creditForm.status,
        // reference: this.creditForm.reference || undefined,
        // installments: this.creditForm.installments
      };
    }

    this.transactionAdded.emit(transaction);
    this.resetForms();
  }

  onCancel() {
    this.cancelled.emit();
    this.resetForms();
  }
}
