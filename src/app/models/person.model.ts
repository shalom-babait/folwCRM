export interface Person {
  person_id?: number;
  first_name: string;
  last_name: string;
  teudat_zehut?: string;
  phone?: string;
  city?: string;
  address?: string;
  birth_date?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'other';
}