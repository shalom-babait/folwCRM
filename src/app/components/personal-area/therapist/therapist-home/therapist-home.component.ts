// therapist-dashboard.component.ts
import { Component } from '@angular/core';


@Component({
  selector: 'app-therapist-home',
  templateUrl: './therapist-home.component.html',
  styleUrls: ['./therapist-home.component.css']

})
export class TherapistHomeComponent {


  therapistId: number | undefined = undefined;

  constructor() {}

  ngOnInit() {
    // קביעת מזהה מטפל
    const id = localStorage.getItem('therapist_id');
    this.therapistId = id ? Number(id) : undefined;
  }


  // אין צורך ב-ngOnDestroy


  // פונקציות נוספות הוסרו – נשאר רק מה שנדרש ל-HTML
}
