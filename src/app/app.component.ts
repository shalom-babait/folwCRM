import { Component, ElementRef, OnInit } from '@angular/core';
import { PatientInitService } from './core/patient-init.service';
import { Router } from '@angular/router';
import { Activities } from './classes/activities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'folwCRM';
}


