export interface UserData {
  user_id?: number;
  first_name: string;
  last_name: string;
  teudat_zehut?: string;
  phone?: string;
  city?: string;
  address?: string;
  email: string;
  password?: string; 
  role?: 'secretary' | 'manager' | 'therapist' | 'patient' | 'other';
  agree?: 0 | 1;
  created_at?: string; // YYYY-MM-DD HH:mm:ss
  gender?: 'male' | 'female' | 'other';
  birth_date?: string; // YYYY-MM-DD
}