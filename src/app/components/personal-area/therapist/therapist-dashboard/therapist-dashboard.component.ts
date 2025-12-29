// therapist-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TherapistSessionService } from 'src/app/services/therapist-session.service';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { TherapistService } from 'src/app/services/therapist.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';

@Component({
  selector: 'app-therapist-dashboard',
  templateUrl: './therapist-dashboard.component.html',
  styleUrls: ['./therapist-dashboard.component.css']
})
export class TherapistDashboardComponent implements OnInit {
  selectedSection: string = 'home';
  therapistId: number | undefined;

  constructor(private therapistSessionService: TherapistSessionService) {}

  ngOnInit() {
    this.therapistId = this.therapistSessionService.getTherapistId();
    this.therapistSessionService.therapist$.subscribe((t: any) => {
      this.therapistId = t?.therapist?.therapist_id;
    });
  }

  onSectionChange(section: string) {
    this.selectedSection = section;
  }
}