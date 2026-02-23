
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, ExpenseCategory } from '../models/expenses.model';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private baseUrl = environment.apiUrl + '/expenses';

  constructor(private http: HttpClient) { }

  // שליפת כל ההוצאות
  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.baseUrl}/all`);
  }

  // שליפת הוצאה בודדת
  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${id}`);
  }
  // הוספת קטגוריה חדשה להוצאה
  addExpenseCategory(category: Partial<ExpenseCategory>): Observable<ExpenseCategory> {
    return this.http.post<ExpenseCategory>(`${this.baseUrl}/categories`, category);
  }
  // יצירת הוצאה
  createExpense(expense: Partial<Expense>): Observable<Expense> {
    return this.http.post<Expense>(`${this.baseUrl}/create`, expense);
  }

  // עדכון הוצאה
  updateExpense(id: number, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/${id}`, expense);
  }

  // מחיקת הוצאה
  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // הוספת קריאת API לקטגוריות הוצאה
  getExpenseCategories(): Observable<ExpenseCategory[]> {
    return this.http.get<ExpenseCategory[]>(`${this.baseUrl}/categories`);
  }
}
