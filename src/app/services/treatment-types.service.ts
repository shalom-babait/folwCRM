import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreatmentType } from 'src/app/models/treatment-type.model';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TreatmentTypesService {
	private apiUrl = `${environment.apiUrl}/treatmentTypes`;

	constructor(private http: HttpClient) {}

	getTreatmentTypes(): Observable<{ success: boolean; data: TreatmentType[] }> {
		return this.http.get<TreatmentType[]>(`${this.apiUrl}/getAll`).pipe(
			map((data) => ({
				success: true,
				data: data
			}))
		);
	}

	createTreatmentType(treatmentType: TreatmentType): Observable<{ success: boolean; data: TreatmentType }> {
		return this.http.post<{ success: boolean; data: TreatmentType }>(
			`${this.apiUrl}/create`,
			treatmentType
		);
	}
}
