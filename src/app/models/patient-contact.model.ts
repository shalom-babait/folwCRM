export type RelationType = 'mother' | 'father' | 'guardian' | 'family_member' | 'other';

export interface PatientContact {
  patient_contacts_id?: number; // Primary key, auto-increment
  patient_id: number;
  contact_person_id: number;
  relation_type: RelationType;
  is_primary: boolean;
  created_at?: string; // ISO timestamp
}
