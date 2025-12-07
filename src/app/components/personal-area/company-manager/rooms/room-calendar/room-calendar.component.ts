import { Component, Input, Output, EventEmitter, SimpleChanges, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
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
  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;
  @Input() roomId?: number; // אופציונלי, לשימושים אחרים
  @Input() events: any[] = [];
  @Output() dateSelected = new EventEmitter<any>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'timeGridWeek', // ברירת מחדל שבועי
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'heMonth,heWeek,heDay'
    },
    customButtons: {
      heMonth: {
        text: 'חודש',
        click: () => this.changeView('dayGridMonth')
      },
      heWeek: {
        text: 'שבוע',
        click: () => this.changeView('timeGridWeek')
      },
      heDay: {
        text: 'יום',
        click: () => this.changeView('timeGridDay')
      }
    },
    events: [],
    dateClick: (arg) => this.onDateClick(arg),
    locale: 'he',
    timeZone: 'local',
    direction: 'rtl',
    dayHeaders: true,
    firstDay: 0,
    eventContent: function(arg) {
      // Prefer therapist_name if available, fallback to title
      const therapistName = arg.event.extendedProps && arg.event.extendedProps['therapist_name'];
      const displayTitle = therapistName || arg.event.title;
      return {
        html: `<div class='custom-event'><span class='custom-event-text'>${displayTitle}</span></div>`
      };
    }
  };

  changeView(viewName: string) {
    if (this.calendarComponent && this.calendarComponent.getApi) {
      this.calendarComponent.getApi().changeView(viewName);
    }
  }

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data?: any) {
    // לוגים לאבחון
    if (data) {
      console.log('RoomCalendarComponent dialog data:', data);
      if (data.events) {
        this.events = data.events;
        console.log('RoomCalendarComponent events:', this.events);
        this.calendarOptions.events = this.events;
      }
    }
  }

  ngOnInit(): void {
    // לא לדרוס את calendarOptions.events כאן, רק ב-ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events
      };
      if (this.calendarComponent && this.calendarComponent.getApi) {
        const api = this.calendarComponent.getApi();
        api.removeAllEvents();
        api.addEventSource(this.events);
      }
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
