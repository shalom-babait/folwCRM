// מודל ApiResponse<T> מייצג תשובת API כללית לכל סוג נתון
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}