// Prospect with categories
import { Category } from './category.model';

export type ProspectStatus = 'new' | 'contacted' | 'converted' | 'not_relevant';

export interface Prospect {
  prospect_id?: number; // יתקבל מהשרת
  first_name: string;
  last_name: string;
  phone: string;
  phone_alt?: string;
  email?: string;
  city?: string;
  referral_source?: string;
  reason_for_visit?: string;
  notes?: string;
  status?: ProspectStatus;
  created_at?: string; // ISO date string
  converted_to_patient_id?: number | null;
  categories?: Category[];
}
