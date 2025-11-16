export type CategoryType = 'prospect' | 'patient' | 'employee' | 'treatment';

export interface Category {
  category_id: number;
  category_type: CategoryType;
  category_name: string;
  category_label: string;
  description?: string;
  color: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}