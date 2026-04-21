import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css', '../../../../../styles/dialog-forms.css']
})
export class AddPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<AddPaymentComponent>,
    private fb: FormBuilder,
    private paymentService: PaymentService
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      payment_date: [this.getTodayDate(), [Validators.required]],
      method: ['מזומן', [Validators.required]],
      status: ['paid'],
      transaction_type: ['credit'],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // אין צורך לטעון מטפלים - נקח את הפרטים מה-localStorage
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.paymentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const user = this.getUserFromLocalStorage();
      if (!user) {
        alert('לא נמצאו פרטי משתמש. אנא התחבר מחדש.');
        this.isSubmitting = false;
        return;
      }

      // קריאת the_id ישירות מ-localStorage
      const therapistId = localStorage.getItem('therapist_id') || 
                         user.therapist_id || 
                         user.therapist?.therapist_id || 
                         null;

      const payment: any = {
        ...this.paymentForm.value,
        organization_id: user.organization_id || user.user?.organization_id,
        appointment_id: null, // הכנסה ישירה ללא קשר לתור
        person_id: user.person_id || user.user?.person_id,
        therapist_id: therapistId
      };

      this.paymentService.createPayment(payment).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('שגיאה בהוספת הכנסה:', error);
          alert('שגיאה בהוספת הכנסה. אנא נסה שוב.');
        }
      });
    }
  }
}
