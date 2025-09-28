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

interface Treatment {
  id: number;
  date: string;
  name: string;
  therapist: string;
  startTime: string;
  endTime: string;
  totalCost: number;
  place?: string;
  notes?: string;
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

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    // אם לא נשלחו טיפולים מהקומפוננטה האב, השתמש בנתונים לדוגמה
    if (this.treatments.length === 0) {
      this.treatments = [
        {
          id: 1,
          date: '2024-01-15',
          name: 'טיפול פיזיותרפיה',
          therapist: 'מרכז רפואי הדסה',
          startTime: '10:00',
          endTime: '11:30',
          totalCost: 300,
          place: 'מרכז רפואי',
          notes: 'טיפול ראשון'
        },
        {
          id: 2,
          date: '2024-01-18',
          name: 'בדיקת מעקב',
          therapist: 'קליניקה פרטית',
          startTime: '14:00',
          endTime: '15:00',
          totalCost: 250,
          place: 'קליניקה פרטית',
          notes: 'המשך טיפול'
        },
        {
          id: 3,
          date: '2024-01-22',
          name: 'טיפול השלמה',
          therapist: 'מרכז רפואי הדסה',
          startTime: '09:00',
          endTime: '10:30',
          totalCost: 300,
          place: 'מרכז רפואי',
          notes: 'בדיקת מעקב'
        }
      ];
    }
  }

  // פילטר טיפולים לפי תאריך
  get filteredTreatments(): Treatment[] {
    if (!this.searchTerm.trim()) {
      return this.treatments;
    }
    
    return this.treatments.filter(treatment => 
      treatment.date.includes(this.searchTerm) ||
      treatment.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      treatment.therapist.toLowerCase().includes(this.searchTerm.toLowerCase())
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
          date: result.date,
          name: result.name || 'טיפול חדש',
          therapist: result.place || result.therapist,
          startTime: result.startTime,
          endTime: result.endTime,
          totalCost: result.cost || this.calculateCost(result.startTime, result.endTime),
          place: result.place,
          notes: result.notes
        };

        // הוספה לרשימה המקומית
        this.treatments.push(newTreatment);
        
        // שליחת האירוע לקומפוננטה האב
        this.treatmentAdded.emit(newTreatment);
      }
    });
  }

  // חישוב עלות לפי זמן (פונקציה עזר)
  private calculateCost(startTime: string, endTime: string): number {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.round(durationHours * 200); // 200 ש"ח לשעה
  }

  // פורמט תאריך לתצוגה
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  }

  // פורמט מחיר
  formatCurrency(amount: number): string {
    return `₪${amount.toLocaleString()}`;
  }

  // מחיקת טיפול
  deleteTreatment(treatmentId: number): void {
    this.treatments = this.treatments.filter(t => t.id !== treatmentId);
    this.treatmentDeleted.emit(treatmentId);
  }

  // עריכת טיפול
  editTreatment(treatment: Treatment): void {
    // יכול לפתוח דיאלוג עריכה או להוסיף לוגיקה אחרת
    console.log('עריכת טיפול:', treatment);
    // TODO: להוסיף דיאלוג עריכה
  }
}