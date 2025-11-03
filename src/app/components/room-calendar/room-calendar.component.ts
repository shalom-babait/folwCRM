import { Component, Input, Output, EventEmitter, SimpleChanges, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-room-calendar',
  templateUrl: './room-calendar.component.html',
  styleUrls: ['./room-calendar.component.css']
})
export class RoomCalendarComponent implements OnInit {
  @Input() roomId!: number;
  @Input() events: any[] = [];
  @Output() dateSelected = new EventEmitter<any>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    events: [],
    dateClick: (arg) => this.onDateClick(arg),
    locale: 'he',
    timeZone: 'local',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    eventContent: function(arg) {
      return {
        html: `<span style='color:#1a237e;font-weight:bold;background:#fff;padding:2px 6px;border-radius:6px;border:1px solid #1a237e;'>${arg.event.title}</span>`
      };
    }
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // לוגים לאבחון
    console.log('RoomCalendarComponent dialog data:', data);
    if (data && data.events) {
      this.events = data.events;
      console.log('RoomCalendarComponent events:', this.events);
      this.calendarOptions.events = this.events;
    }
  }

  ngOnInit(): void {
    // לוגים לאבחון
    console.log('RoomCalendarComponent ngOnInit events:', this.events);
    if (this.events && this.events.length > 0) {
      this.calendarOptions.events = this.events;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
      console.log('RoomCalendarComponent ngOnChanges events:', this.events);
      this.calendarOptions.events = this.events;
    }
  }

  onDateClick(arg: any) {
    const clickedDate = new Date(arg.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate < today) {
      alert('תאריך זה חלף / לא ניתן לקבוע פגישה חדשה');
      return;
    }
    this.dateSelected.emit(arg);
  }
}
