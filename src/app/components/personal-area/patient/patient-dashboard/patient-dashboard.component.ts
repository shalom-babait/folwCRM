// import { Component } from '@angular/core';
// import { Patient, PatientService } from 'src/app/services/patient.service';

// @Component({
//   selector: 'app-patient-dashboard',
//   templateUrl: './patient-dashboard.component.html',
//   styleUrls: ['./patient-dashboard.component.css']
// })
// export class PatientDashboardComponent {
//   patient: Patient | null = null;

//   constructor(private patientService: PatientService) {}

//   ngOnInit() {
//     // נרשם ל-BehaviorSubject כדי לקבל את המטופל שנבחר
//     this.patientService.selectedPatient$.subscribe(patientId => {
//       if (patientId !== null) {
//         this.patientService.getPatientById(patientId).subscribe(data => {
//           this.patient = data;
//         });
//       }
//     });
//   }
// }
// patient-dashboard.component.ts
// patient-dashboard.component.ts
// patient-dashboard.component.ts
import { Component, OnInit } from '@angular/core';

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
}

interface Treatment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  place: string;
  notes: string;
  duration: number; // בדקות
  cost: number;
  name?: string; // הוסף את השדה הזה
  therapist?: string; // הוסף את השדה הזה
  totalCost?: number; // הוסף את השדה הזה
}

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  
  // פרטי המטופל
  patient: Patient = {
    id: 1,
    name: 'ישראל ישראלי',
    phone: '050-123-4567',
    email: 'israel@example.com',
    birthDate: '1985-05-15',
    address: 'רחוב הרצל 123, תל אביב'
  };

  // רשימת הטיפולים
  treatments: Treatment[] = [
    {
      id: 1,
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '11:30',
      place: 'מרכז רפואי',
      notes: 'טיפול ראשון',
      duration: 90,
      cost: 300,
      name: 'טיפול פיזיותרפיה',
      therapist: 'מרכז רפואי הדסה',
      totalCost: 300
    },
    {
      id: 2,
      date: '2024-01-18',
      startTime: '14:00',
      endTime: '15:00',
      place: 'קליניקה פרטית',
      notes: 'המשך טיפול',
      duration: 60,
      cost: 250,
      name: 'בדיקת מעקב',
      therapist: 'קליניקה פרטית',
      totalCost: 250
    },
    {
      id: 3,
      date: '2024-01-22',
      startTime: '09:00',
      endTime: '10:30',
      place: 'מרכז רפואי',
      notes: 'בדיקת מעקב',
      duration: 90,
      cost: 300,
      name: 'טיפול השלמה',
      therapist: 'מרכז רפואי הדסה',
      totalCost: 300
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  // חישוב סך שעות טיפול
  get totalHours(): number {
    const totalMinutes = this.treatments.reduce((sum, treatment) => sum + treatment.duration, 0);
    return Math.round((totalMinutes / 60) * 10) / 10; // עיגול לעשירית
  }

  // חישוב סך עלות
  get totalCost(): number {
    return this.treatments.reduce((sum, treatment) => sum + treatment.cost, 0);
  }

  // עדכון פרטי מטופל
  onPatientUpdated(updatedPatient: Patient): void {
    this.patient = { ...updatedPatient };
  }

  // הוספת טיפול חדש
  onTreatmentAdded(newTreatment: Treatment): void {
    this.treatments.push({
      ...newTreatment,
      id: Math.max(...this.treatments.map(t => t.id)) + 1
    });
  }

  // מחיקת טיפול
  onTreatmentDeleted(treatmentId: number): void {
    this.treatments = this.treatments.filter(t => t.id !== treatmentId);
  }
}