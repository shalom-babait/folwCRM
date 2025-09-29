// import { Component, OnInit } from '@angular/core';
// import { PatientService } from 'src/app/services/patient.service';
// import { MatDialog } from '@angular/material/dialog';
// import { CreateTreatmentDialogComponent } from '../add-treatment-dialog/add-treatment-dialog.component';
// import { AddPatientDialogComponent } from '../add-patient-dialog/add-patient-dialog.component';

// @Component({
//   selector: 'app-treatment-list',
//   templateUrl: './treatment-list.component.html',
//   styleUrls: ['./treatment-list.component.css']
// })
// export class TreatmentListComponent implements OnInit {
//   treatments: any[] = [];
//   searchTerm: string = '';

//   constructor(
//     private patientService: PatientService,
//     private dialog: MatDialog
//   ) { }

//   ngOnInit(): void {
//     this.patientService.getTreatments().subscribe(data => {
//       this.treatments = data;
//     });
//   }

//   openCreateTreatmentDialog() {
//     const dialogRef = this.dialog.open(AddPatientDialogComponent, {
//       width: '400px'
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         // אם צריך, רענון רשימת טיפולים אחרי הוספה
//         this.patientService.getTreatments().subscribe(data => {
//           this.treatments = data;
//         });
//       }
//     });
//   }
// }
// treatment-list.component.ts
// treatment-list.component.ts
// treatment-list.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateTreatmentDialogComponent } from '../add-treatment-dialog/add-treatment-dialog.component';
import { PatientService, AppointmentResponse } from 'src/app/services/patient.service';

interface Treatment {
  id: number;
  appointment_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  room: string;
  status: string;
  treatment_type: string;
  patient_id: number;
  total_minutes?: number;
}
@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.css']
})
export class TreatmentListComponent implements OnInit {
  @Input() treatments: Treatment[] = [];
  @Output() treatmentAdded = new EventEmitter<Treatment>();
  @Output() treatmentDeleted = new EventEmitter<number>();

  searchTerm: string = '';
  showTreatments: AppointmentResponse[] = [];

  constructor(
    private dialog: MatDialog,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    // Load treatments from the server if none are provided through Input
    if (this.treatments.length === 0) {
      this.patientService.getTreatments().subscribe(data => {
        console.log('Treatments data:', data);
        this.showTreatments = data;
        // Map server response to Treatment interface
        this.treatments = this.showTreatments.map(appointment => ({
          ...appointment,
          id: appointment.appointment_id,
          patient_id: 0 // This should be set based on the current patient context
        }));
      });
    }
  }

  // פילטר טיפולים לפי תאריך
  get filteredTreatments(): Treatment[] {
    if (!this.searchTerm.trim()) {
      return this.treatments;
    }
    
    return this.treatments.filter(treatment => 
      treatment.appointment_date.includes(this.searchTerm) ||
      treatment.treatment_type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      treatment.room.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // פתיחת דיאלוג הוספת טיפול
  openCreateTreatmentDialog(): void {
    const dialogRef = this.dialog.open(CreateTreatmentDialogComponent, {
      width: '500px',
      direction: 'rtl'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // יצירת טיפול חדש
        const newTreatment: Treatment = {
          id: this.treatments.length > 0 ? Math.max(...this.treatments.map(t => t.id)) + 1 : 1,
          appointment_id: this.treatments.length > 0 ? Math.max(...this.treatments.map(t => t.appointment_id)) + 1 : 1,
          appointment_date: result.date,
          treatment_type: result.name || 'טיפול חדש',
          room: result.place || '',
          start_time: result.startTime,
          end_time: result.endTime,
          status: 'scheduled',
          patient_id: 0 // This should be set based on the current patient context
        };

        // הוספה לרשימה המקומית
        this.treatments.push(newTreatment);
        
        // שליחת האירוע לקומפוננטה האב
        this.treatmentAdded.emit(newTreatment);
      }
    });
  }

  // פורמט תאריך לתצוגה
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  }

  // מחיקת טיפול
  deleteTreatment(treatmentId: number): void {
    this.treatments = this.treatments.filter(t => t.appointment_id !== treatmentId);
    this.treatmentDeleted.emit(treatmentId);
    // Refresh the treatments list from server
    this.patientService.getTreatments().subscribe(data => {
      this.showTreatments = data;
      this.treatments = this.showTreatments.map(appointment => ({
        ...appointment,
        id: appointment.appointment_id,
        patient_id: 0
      }));
    });
  }

  // עריכת טיפול
  editTreatment(treatment: Treatment): void {
    // יכול לפתוח דיאלוג עריכה או להוסיף לוגיקה אחרת
    console.log('עריכת טיפול:', treatment);
    // TODO: להוסיף דיאלוג עריכה
  }
}