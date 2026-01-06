import { SelectedDepartmentForSave } from './department-group.model';
import { Person } from './person.model';
import { UserData, UserDataWithPerson } from './user.model';

export interface TherapistCreationData {
  user: UserData;
  person: Person; 
  therapist: TherapistData;
  selectedDepartments: SelectedDepartmentForSave[];
}

// נתונים ספציפיים למטפל
export interface TherapistData {
  // נתונים להצגת מטפל קיים
  therapist_id?: number;
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  // specialization?: string;
  // experience_years?: number;
}