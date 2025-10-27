export interface Payment {
  pay_id?: number;
  appointment_id: number;
  amount: number;
  payment_date?: Date;
  method: 'כרטיס אשראי' | 'העברה בנקאית' | 'מזומן';
}
