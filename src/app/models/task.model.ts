export enum TaskStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}
export interface Task {
  task_id?: number; // PK

  title: string;
  description?: string | null;

  patient_id?: number | null;

  created_by_user_id: number;
  assigned_to_user_id: number;

  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | null;

  due_date?: string | null;       // YYYY-MM-DD
  completed_at?: string | null;   // ISO timestamp

  color?: string; // למשל: '#6FA79A' – לשימוש UI בלבד

  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}
