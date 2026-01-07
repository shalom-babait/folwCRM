import { Component } from '@angular/core';

@Component({
  selector: 'app-therapist-settings-view',
  templateUrl: './therapist-settings-view.component.html',
  styleUrls: ['./therapist-settings-view.component.css']
})
export class TherapistSettingsViewComponent {
  selectedSetting: string | null = null;

  onMenuSelect(setting: string) {
    this.selectedSetting = setting;
  }
}
