import { Component } from '@angular/core';
import { TherapistCreationData, TherapistData } from 'src/app/models/therapist.model';

@Component({
  selector: 'app-therapists-view',
  templateUrl: './therapists-view.component.html',
  styleUrls: ['./therapists-view.component.css']
})
export class TherapistsViewComponent {
  selectedTherapist: TherapistCreationData | null = null;
  showDetails: boolean = false;

  onTherapistSelected(therapist: TherapistCreationData): void {
    this.selectedTherapist = therapist;
    this.showDetails = true;
  }

  onCloseDetails(): void {
    this.showDetails = false;
    this.selectedTherapist = null;
  }
}