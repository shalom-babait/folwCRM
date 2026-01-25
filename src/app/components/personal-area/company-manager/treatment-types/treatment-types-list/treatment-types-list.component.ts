import { Component, OnInit } from '@angular/core';
import { TreatmentTypesService } from 'src/app/services/treatment-types.service';
import { TreatmentType } from 'src/app/models/treatment-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTreatmentTypeDialogComponent } from '../add-treatment-type-dialog/add-treatment-type-dialog.component';
import { TherapistService } from 'src/app/services/therapist.service';

@Component({
	selector: 'app-treatment-types-list',
	templateUrl: './treatment-types-list.component.html',
	styleUrls: ['./treatment-types-list.component.css']
})
export class TreatmentTypesListComponent implements OnInit {
	treatmentTypes: TreatmentType[] = [];
	therapistId: number | null = null;
	isSubmitting = false;
	userRole: string | null = null;

	constructor(
		private treatmentTypesService: TreatmentTypesService,
		private authService: AuthService,
		private patientService: PatientService,
		private therapistService: TherapistService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.userRole = this.authService.getRoleFromToken();
		this.loadTherapistId();
	}

	loadTreatmentTypes(): void {
		// אם מטפל - שלח את ה-therapist_id, אם מנהל - אל תשלח (יקבל הכל)
		const therapistIdToSend = this.userRole === 'therapist' ? this.therapistId : null;
		
		this.treatmentTypesService.getTreatmentTypes(therapistIdToSend).subscribe({
			next: (response) => {
				this.treatmentTypes = response.data;
			},
			error: (err) => {
				console.error('Error fetching treatment types:', err);
			}
		});
	}

	loadTherapistId(): void {
		const userId = this.authService.getCurrentUserId();
		if (!userId) {
			console.error('User not logged in');
			return;
		}

		// אם זה מטפל, נמצא את ה-therapist_id שלו
		if (this.userRole === 'therapist') {
			this.patientService.getTherapistIdByUserId(userId).subscribe({
				next: (therapistId) => {
					this.therapistId = therapistId;
					// טוען את הרשימה רק אחרי שמצאנו את ה-therapist_id
					this.loadTreatmentTypes();
				},
				error: (err) => {
					console.error('Error fetching therapist ID:', err);
					// גם במקרה של שגיאה, טוען את הרשימה
					this.loadTreatmentTypes();
				}
			});
		} else {
			// אם זה מנהל, therapistId יישאר null ונטען את הרשימה מיד
			this.loadTreatmentTypes();
		}
	}

	openAddDialog(): void {
		// אם זה מטפל ואין therapistId
		if (this.userRole === 'therapist' && !this.therapistId) {
			alert('לא ניתן להוסיף סוג טיפול - מזהה מטפל לא נמצא. אנא וודא שאתה מחובר כמטפל.');
			return;
		}

		const dialogRef = this.dialog.open(AddTreatmentTypeDialogComponent, {
			width: '500px',
			direction: 'rtl',
			data: { 
				therapistId: this.therapistId,
				userRole: this.userRole
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.isSubmitting = true;
				this.treatmentTypesService.createTreatmentType(result).subscribe({
					next: (response) => {
						if (response.success) {
							alert('סוג הטיפול נוסף בהצלחה');
							this.loadTreatmentTypes();
						}
						this.isSubmitting = false;
					},
					error: (err) => {
						console.error('Error creating treatment type:', err);
						alert('שגיאה בהוספת סוג הטיפול');
						this.isSubmitting = false;
					}
				});
			}
		});
	}
}
