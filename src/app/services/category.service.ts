import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, CategoryFormData } from 'src/app/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) { }

getAllCategories(): Observable<{ data: Category[] }> {
  return this.http.get<{ success: boolean; data: Category[] }>(`${this.apiUrl}/list`)
}

  getCategoryById(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${categoryId}`);
  }

  getCategoriesByType(categoryType: string): Observable<{ data: Category[] }> {
    // backend route is: GET /categories/list/type/:type
    return this.http.get<{ success: boolean; data: Category[] }>(`${this.apiUrl}/list/type/${categoryType}`);
  }

  /**
   * Get categories assigned to a specific entity (e.g. prospect, patient)
   * Expected backend route: GET /categories/entity/:entityType/:entityId
   */
  getCategoriesByEntity(entityType: string, entityId: number): Observable<{ data: Category[] }> {
    return this.http.get<{ success: boolean; data: Category[] }>(`${this.apiUrl}/entity/${entityType}/${entityId}`);
  }
  /**
   * Create a new category. Send only the editable fields (CategoryFormData).
   * The server returns the full Category (with id and timestamps).
   */
  createCategory(category: CategoryFormData): Observable<Category> {
    console.log('Creating category with data:', category);
    console.log('API URL:', this.apiUrl + '/create');
    return this.http.post<Category>(this.apiUrl + '/create', category);
  }

  /**
   * Update an existing category by id. Accepts CategoryFormData payload.
   */
  updateCategory(categoryId: number, category: CategoryFormData): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${categoryId}`, category);
  }

  deleteCategory(categoryId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${categoryId}`);
  }
}
