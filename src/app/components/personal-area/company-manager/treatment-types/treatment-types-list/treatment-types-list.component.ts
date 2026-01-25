import { Component, OnInit } from '@angular/core';
import { TreatmentTypesService } from 'src/app/services/treatment-types.service';
import { TreatmentType } from 'src/app/models/treatment-type.model';

@Component({
	selector: 'app-treatment-types-list',
	templateUrl: './treatment-types-list.component.html',
	styleUrls: ['./treatment-types-list.component.css']
})
export class TreatmentTypesListComponent implements OnInit {
	treatmentTypes: TreatmentType[] = []; // נשתמש במודל TreatmentType

	constructor(private treatmentTypesService: TreatmentTypesService) {}

	ngOnInit(): void {
		this.loadTreatmentTypes();
	}

	loadTreatmentTypes(): void {
		this.treatmentTypesService.getTreatmentTypes().subscribe({
			next: (response) => {
				this.treatmentTypes = response.data; // ניגש ישירות למערך data
			},
			error: (err) => {
				console.error('Error fetching treatment types:', err);
			}
		});
	}
}
