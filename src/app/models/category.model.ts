export type CategoryType = 'prospect' | 'patient' | 'employee' | 'treatment';

// המודל הבסיסי שכבר יש לך
export interface Category {
  category_id: number;
  category_type: CategoryType;
  category_name: string;
  category_label: string;
  description?: string;
  color: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ליצירת/עדכון קטגוריה (בלי ה־ID והתאריכים)
export interface CategoryFormData {
  category_type: CategoryType;
  category_name: string;
  description?: string;
  color?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

// לשיוך קטגוריות - דומה ל-SelectedDepartmentForSave שלך
export interface SelectedCategoryForSave {
  category_id: number;
}

// לקטגוריה עם מידע על השיוך
export interface CategoryAssignment {
  category: Category;
  assigned_at: string;
  assigned_by?: number;
}

// מודל מקיף לשמירת ישות עם קטגוריות (דומה ל-TherapistCreationData)
export interface EntityCategoriesData<T> {
  entity: T;
  selectedCategories: SelectedCategoryForSave[];
}

// // דוגמאות ספציפיות לשימוש
// export interface ProspectWithCategories {
//   prospect: ProspectData; // הטייפ של המתעניין שלך
//   selectedCategories: SelectedCategoryForSave[];
// }

// export interface PatientWithCategories {
//   patient: PatientData; // הטייפ של המטופל שלך
//   selectedCategories: SelectedCategoryForSave[];
// }

// export interface UserWithCategories {
//   user: UserData;
//   selectedCategories: SelectedCategoryForSave[];
// }