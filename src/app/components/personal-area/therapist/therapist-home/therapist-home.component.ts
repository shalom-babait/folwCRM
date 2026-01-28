// therapist-dashboard.component.ts
import { Component } from '@angular/core';


@Component({
  selector: 'app-therapist-home',
  templateUrl: './therapist-home.component.html',
  styleUrls: ['./therapist-home.component.css']

})
export class TherapistHomeComponent {
  // סינון משימות בסטטוס 'פתוח' בלבד
  taskOpenStatusFilter = (task: any) => task.status === 'open';
  userId: number | null = null;
  therapistId: number | null = null;

  constructor() {}

  ngOnInit() {
    // קביעת מזהה יוזר ומטפל מתוך אובייקט user
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      this.userId = userObj.user_id ?? null;
      this.therapistId = userObj.role === 'therapist' ? userObj.user_id : null;
    } else {
      this.userId = null;
      this.therapistId = null;
    }
  }


  // אין צורך ב-ngOnDestroy


  // פונקציות נוספות הוסרו – נשאר רק מה שנדרש ל-HTML
}
