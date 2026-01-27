import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-therapist-settings-menu',
  templateUrl: './therapist-settings-menu.component.html',
  styleUrls: ['./therapist-settings-menu.component.css']
})
export class TherapistSettingsMenuComponent {
  @Output() menuSelect = new EventEmitter<string>();
  menuClosed = false;

  onSelect(setting: string) {
    this.menuSelect.emit(setting);
  }

  toggleMenu() {
    this.menuClosed = !this.menuClosed;
  }
}
