import { Person } from "./person.model";

export interface UserData {
  user_id?: number;
  person_id?: number; 
  user_name: string;
  password?: string;
  role?: 'secretary' | 'manager' | 'therapist' | 'patient' | 'other';
  agree?: 0 | 1;
  created_at?: string;
}
export interface UserLogin {  
  user_name: string;
  password: string;
}
export interface UserDataWithPerson {
  user: UserData;
  person: Person;
}