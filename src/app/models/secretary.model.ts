import { UserData } from './user.model';

export interface SecretaryCreationData {
  user: UserData;
  therapist:secretaryData
}

// נתונים ספציפיים למטפל
export interface secretaryData {
  // נתונים להצגת מטפל קיים
  therapist_id?: number;
  specialization?: string;
  experience_years?: number;
}