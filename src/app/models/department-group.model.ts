
export interface Department {
  department_id?: number;
  department_name: string;
}

export interface Group {
  userCount: number;
  group_id?: number;
  group_name: string;
  department_id?: number;
  created_at?: string; // או Date אם את ממירה
}

export interface UserDepartment {
  user_department_id?: number;
  user_id: number;
  department_id: number;
}

export interface UserGroup {
  user_group_id?: number;
  user_id: number;
  group_id: number;
}
export interface ApiResponseGroup<T> {
  success: boolean;
  data: T;
}
// מודל למחלקה עם קבוצות
export interface DepartmentWithGroups {
  department: Department;
  groups: Group[];
}

// בחירה של מחלקה וקבוצות שנבחרו בה
export interface SelectedDepartment {
  department: Department;
  selectedGroups: Group[];
}
export interface SelectedItem {
  type: 'department' | 'group';
  department: Department;
  group?: Group;
}
export interface SelectedDepartmentForSave {
  department_id: number;
  group_ids: number[];
}