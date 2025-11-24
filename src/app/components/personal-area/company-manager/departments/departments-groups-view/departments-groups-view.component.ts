import { Component } from '@angular/core';

@Component({
  selector: 'app-departments-groups-view',
  templateUrl: './departments-groups-view.component.html',
  styleUrls: ['./departments-groups-view.component.css','../../../../../styles/views.css']
})
export class DepartmentsGroupViewComponent {

  selectedGroup: any = null;   // ← חדש: הקבוצה שנבחרה
  activeTab: string = 'patients'; // ← ברירת מחדל: מטופלים
  searchTerm: string = '';
  loading: boolean = false;

  /** כאשר נבחרה קבוצה */
  onGroupSelected(group: any): void {
    this.selectedGroup = group;
    this.activeTab = 'patients';  // ברירת מחדל
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  /** סגירת הסרגל */
  onCloseDetails(): void {
    this.selectedGroup = null;
    this.activeTab = 'patients';
  }
}
