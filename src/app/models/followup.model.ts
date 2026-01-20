import { Person } from "./person.model";

export interface FollowUp {
  followup_id?: number;
  person_id: number;             
  follow_date: string;           // YYYY-MM-DD
  follow_time?: string;          // HH:MM:SS, לא חובה
  remind: boolean;
  notes?: string;
  created_at?: string;
  created_by_person_id?: number;
  status?: 'open' | 'completed' | 'cancelled'; // סטטוס מעקב
}

export interface FollowUpWithPerson {
  person:Person,
  followUp:FollowUp
}