// נתונים כלליים של המשתמש
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
  role?: 'מזכיר' | 'מנהל' | 'מטפל' | 'מטופל';
  agree?: 0 | 1;
  created_at?: string; // YYYY-MM-DD HH:mm:ss
}

