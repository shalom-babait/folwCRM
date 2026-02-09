export interface Organization {
  organization_id?: number;
  organization_name: string;
  owner_user_id: number;
  organization_type: 'company' | 'clinic' | 'personal';
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}
