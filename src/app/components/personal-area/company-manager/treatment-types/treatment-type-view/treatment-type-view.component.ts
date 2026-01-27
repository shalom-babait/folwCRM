import { Component } from '@angular/core';
import { TreatmentType } from 'src/app/models/treatment-type.model';

@Component({
  selector: 'app-treatment-type-view',
  templateUrl: './treatment-type-view.component.html',
  styleUrls: ['./treatment-type-view.component.css',
    '../../../../../styles/views.css'
  ]
})
export class TreatmentTypeViewComponent {
  selectedTreatmentType: TreatmentType | null = null;
  activeTab:
    | 'settings'
    | 'protocols'
    | 'questionnaires'
    | 'pricing'
    | 'addons'
    | 'notes'
    | 'files' = 'settings';

  onTreatmentTypeSelected(type: TreatmentType) {
    this.selectedTreatmentType = type;
    this.activeTab = 'settings';
  }

  setActiveTab(
    tab:
      | 'settings'
      | 'protocols'
      | 'questionnaires'
      | 'pricing'
      | 'addons'
      | 'notes'
      | 'files'
  ) {
    this.activeTab = tab;
  }
}
