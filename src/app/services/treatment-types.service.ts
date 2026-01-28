import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TreatmentType } from 'src/app/models/treatment-type.model';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TreatmentTypesService {
	private apiUrl = `${environment.apiUrl}/treatmentTypes`;
	
	// State Management
	private selectedTreatmentTypeSubject = new BehaviorSubject<TreatmentType | null>(null);
	public selectedTreatmentType$ = this.selectedTreatmentTypeSubject.asObservable();

	private treatmentTypesListSubject = new BehaviorSubject<TreatmentType[]>([]);
	public treatmentTypesList$ = this.treatmentTypesListSubject.asObservable();

	constructor(private http: HttpClient) {}

	// State Actions
	selectTreatmentType(type: TreatmentType | null): void {
		this.selectedTreatmentTypeSubject.next(type);
	}

	getSelectedTreatmentType(): TreatmentType | null {
		return this.selectedTreatmentTypeSubject.value;
	}

	updateTreatmentTypesList(types: TreatmentType[]): void {
		this.treatmentTypesListSubject.next(types);
	}

	getTreatmentTypes(therapist_id?: number | null): Observable<{ success: boolean; data: TreatmentType[] }> {
		let url = `${this.apiUrl}/getAll`;
		if (therapist_id) {
			url += `?therapist_id=${therapist_id}`;
		}
		return this.http.get<TreatmentType[]>(url).pipe(
			map((data) => ({
				success: true,
				data: data
			})),
			tap((response) => {
				this.updateTreatmentTypesList(response.data);
			})
		);
	}

	createTreatmentType(treatmentType: TreatmentType): Observable<{ success: boolean; data: TreatmentType }> {
		return this.http.post<{ success: boolean; data: TreatmentType }>(
			`${this.apiUrl}/create`,
			treatmentType
		).pipe(
			tap((response) => {
				if (response.success) {
					// עדכן את הרשימה המקומית
					const currentList = this.treatmentTypesListSubject.value;
					this.updateTreatmentTypesList([...currentList, response.data]);
				}
			})
		);
	}

	updateTreatmentType(treatmentType: TreatmentType): Observable<{ success: boolean; data: TreatmentType }> {
		return this.http.put<{ success: boolean; data: TreatmentType }>(
			`${this.apiUrl}/update/${treatmentType.treatment_type_id}`,
			treatmentType
		).pipe(
			tap((response) => {
				if (response.success) {
					// עדכן את הטיפול הנבחר
					this.selectTreatmentType(treatmentType);
					
					// עדכן את הרשימה המקומית
					const currentList = this.treatmentTypesListSubject.value;
					const updatedList = currentList.map(item => 
						item.treatment_type_id === treatmentType.treatment_type_id 
							? treatmentType 
							: item
					);
					this.updateTreatmentTypesList(updatedList);
				}
			})
		);
	}

	deleteTreatmentType(type: TreatmentType): Observable<any> {
		return this.http.delete(`${this.apiUrl}/delete/${type.treatment_type_id}`).pipe(
			tap(() => {
				// עדכן את הרשימה המקומית
				const currentList = this.treatmentTypesListSubject.value;
				const updatedList = currentList.filter(
					item => item.treatment_type_id !== type.treatment_type_id
				);
				this.updateTreatmentTypesList(updatedList);
				
				// אם זה הטיפול שנבחר, נקה את הבחירה
				const current = this.getSelectedTreatmentType();
				if (current && current.treatment_type_id === type.treatment_type_id) {
					this.selectTreatmentType(null);
				}
			})
		);
	}
}
