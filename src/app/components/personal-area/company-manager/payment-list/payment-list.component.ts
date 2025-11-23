import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionComponent } from '../payment/add-transaction/add-transaction.component';
import { PatientService } from 'src/app/services/patient.service';

interface Transaction {
  date: Date;
  description: string;
  debit: number;  // חובה
  credit: number; // זכות
  balance: number; // יתרה
}

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  transactions: Transaction[] = [];
  totalDebits = 0;
  totalCredits = 0;
  finalBalance = 0;
  patientId: string = '';
  appointments: any[] = [];
  constructor(private dialog: MatDialog, private patientService: PatientService) {}


  ngOnInit() {
    this.loadTransactions();
    this.calculateTotals();
  }

  loadTransactions() {
    // דוגמה לנתונים - להחליף בקריאה לשרת
    const sampleData = [
      { date: new Date('2025-01-05'), description: 'טיפול שורש', debit: 1500, credit: 0 },
      { date: new Date('2025-01-10'), description: 'תשלום', debit: 0, credit: 500 },
      { date: new Date('2025-01-15'), description: 'ניקוי אבנית', debit: 400, credit: 0 },
      { date: new Date('2025-01-20'), description: 'תשלום', debit: 0, credit: 1000 },
      { date: new Date('2025-02-01'), description: 'כתר', debit: 2000, credit: 0 },
      { date: new Date('2025-02-05'), description: 'תשלום', debit: 0, credit: 1500 }
    ];

    let runningBalance = 0;
    this.transactions = sampleData.map(item => {
      runningBalance += item.debit - item.credit;
      return {
        ...item,
        balance: runningBalance
      };
    });
  }

  calculateTotals() {
    this.totalDebits = this.transactions.reduce((sum, t) => sum + t.debit, 0);
    this.totalCredits = this.transactions.reduce((sum, t) => sum + t.credit, 0);
    this.finalBalance = this.totalDebits - this.totalCredits;
  }

  assignPayment(transaction: Transaction) {
    console.log('שיוך תשלום לטיפול:', transaction);
    // כאן תוסיף לוגיקה לשיוך תשלום
  }

  showDetails(transaction: Transaction) {
    console.log('הצגת פרטים:', transaction);
    // כאן תוסיף לוגיקה להצגת פרטים
  }

  showAddDialog = false;
  newTransaction = {
    date: new Date(),
    description: '',
    type: 'debit', // 'debit' או 'credit'
    amount: 0
  };

  openAddDialog() {
    this.showAddDialog = true;
    this.resetForm();
  }

  closeAddDialog() {
    this.showAddDialog = false;
    this.resetForm();
  }

  resetForm() {
    this.newTransaction = {
      date: new Date(),
      description: '',
      type: 'debit',
      amount: 0
    };
  }

  openAddTransaction(): void {
    const dialogRef = this.dialog.open(AddTransactionComponent, {
      width: '500px',
      direction: 'rtl',
      data: { patient_id: this.patientId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // רענון מלא של הרשימה מהשרת
        // this.patientService.getTreatments(this.patientId).subscribe(data => {
        //   this.appointments = data;
        // });
      }
    });
  }
  // addTransaction() {
  //   if (!this.newTransaction.description || this.newTransaction.amount <= 0) {
  //     alert('יש למלא את כל השדות');
  //     return;
  //   }

  //   const transaction: Transaction = {
  //     date: this.newTransaction.date,
  //     description: this.newTransaction.description,
  //     debit: this.newTransaction.type === 'debit' ? this.newTransaction.amount : 0,
  //     credit: this.newTransaction.type === 'credit' ? this.newTransaction.amount : 0,
  //     balance: 0
  //   };

  //   this.transactions.push(transaction);
  //   this.transactions.sort((a, b) => a.date.getTime() - b.date.getTime());
    
  //   // חישוב מחדש של היתרות
  //   let runningBalance = 0;
  //   this.transactions.forEach(t => {
  //     runningBalance += t.debit - t.credit;
  //     t.balance = runningBalance;
  //   });

  //   this.calculateTotals();
  //   this.closeAddDialog();
  // }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('he-IL');
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return 'balance-positive';

    if (balance < 0) return 'balance-negative';
    return 'balance-zero';
  }
}