// סוגי טרנזקציות לתשלום
export interface DebitTransaction {
  transaction_type: 'debit';
  appointment_id: null | string | number;
  amount: number;
  payment_date: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  method: 'cash' | 'transfer' | 'card';
  therapist_id: number;
}

export interface CreditTransaction {
  appointment_id?: string;
  transaction_type: 'credit';
  amount: number;
  payment_date: string;
  method: 'cash' | 'transfer' | 'card';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  therapist_id: number;
}

export type Transaction = DebitTransaction | CreditTransaction;
export interface Payment {
  pay_id?: number; // או payment_id, לפי מה שמחזיר ה-API
  appointment_id: number;
  amount: number;
  payment_date?: Date; // או string אם לא ממירים ל-Date
  method: 'כרטיס אשראי' | 'העברה בנקאית' | 'מזומן';
  status?: 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_type?: 'debit' | 'credit';
  person_id?: number; // או patient_id, לפי השימוש שלך
  therapist_id: number;
  balance?: number;
}
