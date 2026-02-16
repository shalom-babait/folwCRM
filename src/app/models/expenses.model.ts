// Expense Category Model
export interface ExpenseCategory {
	expense_category_id: number;
	organization_id: number;
	category_name: string;
	description?: string;
	is_active: boolean;
	created_at: string; // ISO date string
}
// Expense Model
export type PaymentMethod = 'cash' | 'credit_card' | 'bank_transfer' | 'check' | 'other';

export interface Expense {
	expense_id: number;
	organization_id: number;
	expense_category_id: number;
	other_category_name?: string | null;
	person_id?: number | null;
	amount: number;
	payment_date: string; // YYYY-MM-DD
	payment_method: PaymentMethod;
	reference_number?: string;
	notes?: string;
	created_at: string; // ISO date string
}
