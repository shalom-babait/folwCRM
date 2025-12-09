import { Component } from '@angular/core';
import { TherapistCreationData } from 'src/app/models/therapist.model';

@Component({
  selector: 'app-therapists-view',
  templateUrl: './therapists-view.component.html',
  styleUrls: ['./therapists-view.component.css'
    , '../../../../styles/views.css'
  ]
})
export class TherapistsViewComponent {
  selectedTherapist: TherapistCreationData | null = null;
  activeTab: string = 'details';

  /**
   * מופעל כאשר נבחר מטפל מהרשימה
   */
  onTherapistSelected(therapist: TherapistCreationData): void {
  this.selectedTherapist = therapist;
  this.activeTab = 'details'; // חזרה לטאב הראשון בכל פעם שבוחרים מטפל חדש
  console.log('Selected therapist:', therapist);
  }

  /**
   * מחליף בין הטאבים השונים
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * סוגר את תצוגת הפרטים וחוזר לסיכום
   */
  onCloseDetails(): void {
    this.selectedTherapist = null;
    this.activeTab = 'details';
  }

  /**
   * בודק אם הטאב הנוכחי הוא הפעיל
   */
  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }
}