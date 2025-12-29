import { Component } from '@angular/core';

@Component({
  selector: 'app-secretary-dashboard',
  templateUrl: './secretary-dashboard.component.html',
  styleUrls: ['./secretary-dashboard.component.css']
})
export class SecretaryDashboardComponent {
  selectedSection: string = 'home';
  onSectionChange(section: string) {
    this.selectedSection = section;
  }
}
