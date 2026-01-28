import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreatmentType } from 'src/app/models/treatment-type.model';
import { TreatmentTypesService } from 'src/app/services/treatment-types.service';

@Component({
  selector: 'app-treatment-type-view',
  templateUrl: './treatment-type-view.component.html',
  styleUrls: ['./treatment-type-view.component.css',
    '../../../../../styles/views.css'
  ]
})
export class TreatmentTypeViewComponent implements OnInit, OnDestroy {
  selectedTreatmentType: TreatmentType | null = null;
  activeTab:
    | 'settings'
    | 'protocols'
    | 'questionnaires'
    | 'pricing'
    | 'addons'
    | 'notes'
    | 'files' = 'settings';
  
  private subscription: Subscription = new Subscription();

  constructor(private treatmentTypesService: TreatmentTypesService) {}

  ngOnInit(): void {
    // האזנה לשינויים ב-state
    this.subscription.add(
      this.treatmentTypesService.selectedTreatmentType$.subscribe(type => {
        this.selectedTreatmentType = type;
        if (type) {
          this.activeTab = 'settings';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
