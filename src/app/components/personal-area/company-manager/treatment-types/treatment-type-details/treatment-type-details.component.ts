import { Component, Input } from '@angular/core';
import { TreatmentType } from 'src/app/models/treatment-type.model';

@Component({
  selector: 'app-treatment-type-details',
  templateUrl: './treatment-type-details.component.html',
  styleUrls: ['./treatment-type-details.component.css']
})
export class TreatmentTypeDetailsComponent {
  @Input() treatmentType: TreatmentType | null = null;
}
