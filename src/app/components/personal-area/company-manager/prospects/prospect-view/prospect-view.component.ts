import { Component } from '@angular/core';

@Component({
  selector: 'app-prospect-view',
  templateUrl: './prospect-view.component.html',
  styleUrls: ['./prospect-view.component.css',
    '../../../../../styles/views.css'
  ]
})
export class ProspectViewComponent {
  selectedProspect: any | null = null;
  activeTab: string = 'details';
  searchTerm: string = '';
  loading: boolean = false;

  /** כאשר נבחר פרוספקט מהרשימה */
  onProspectSelected(prospect: any): void {
    this.selectedProspect = prospect;
    this.activeTab = 'details';
  }

  /** החלפת טאב פעיל */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /** בודק אם טאב מסוים פעיל */
  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  /** סגירת תצוגת פרטים וחזרה לטבלה */
  onCloseDetails(): void {
    this.selectedProspect = null;
    this.activeTab = 'details';
  }
}