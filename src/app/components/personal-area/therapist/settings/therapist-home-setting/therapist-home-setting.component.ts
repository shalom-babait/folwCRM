import { Component } from '@angular/core';

@Component({
  selector: 'app-therapist-home-setting',
  templateUrl: './therapist-home-setting.component.html',
  styleUrls: ['./therapist-home-setting.component.css']
})
export class TherapistHomeSettingComponent {
  showTodayCalendar: boolean = true;
  showScheduledTreatments: boolean = true;
  showWaitingClients: boolean = true;
}
