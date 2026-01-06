import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  settingsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      patientFields: this.fb.group({
        firstName: true,
        lastName: true,
        idNumber: false,
        phone: true,
        email: false
      }),

      modules: this.fb.group({
        calendar: true,
        rooms: false,
        followUps: true,
        reports: true
      }),

      dashboard: this.fb.group({
        todayAppointments: true,
        alerts: true,
        quickActions: true
      })
    });
  }

  save() {
    const settings = this.settingsForm.value;
    console.log('Saving settings:', settings);

    // כאן שולחים לשרת
    // this.settingsService.save(settings).subscribe(...)
  }
}

