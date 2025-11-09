import { SelectedDepartmentForSave } from './department-group.model';
import { UserData } from './user.model';

export interface TherapistCreationData {
  user: UserData;
  therapist: TherapistData;
  selectedDepartments: SelectedDepartmentForSave[];
}

// נתונים ספציפיים למטפל
export interface TherapistData {
  // נתונים להצגת מטפל קיים
  therapist_id?: number;
  specialization?: string;
  experience_years?: number;
}