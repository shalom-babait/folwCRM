import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calendar-overlay',
  templateUrl: './calendar-overlay.component.html',
  styleUrls: ['./calendar-overlay.component.css']
})
export class CalendarOverlayComponent {
  @Input() showOverlay: boolean = false;
  @Input() selectedRoomId: number | null = null;
  @Input() roomEvents: any[] = [];
  @Output() overlayDateSelected = new EventEmitter<any>();
  @Output() closeOverlayEvent = new EventEmitter<void>();

  onOverlayDateSelected(event: any) {
    this.overlayDateSelected.emit(event);
  }

  closeOverlay() {
    this.closeOverlayEvent.emit();
  }
}
