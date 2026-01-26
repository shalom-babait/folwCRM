import { MatDialog } from '@angular/material/dialog';
import { AddAppointmentDialogComponent } from 'src/app/components/personal-area/patient/add-appointment-dialog/add-appointment-dialog.component';

import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  Inject,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-room-calendar',
  templateUrl: './room-calendar.component.html',
  styleUrls: ['./room-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoomCalendarComponent implements OnInit {
  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;

  @Input() roomId?: number;
  @Input() events: any[] = [];
  @Input() miniCalendar: boolean = false;

  @Output() dateSelected = new EventEmitter<any>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],

    initialView: 'timeGridWeek',
    initialDate: new Date(),

    headerToolbar: {
      left: 'todayButton,prev,next',
      center: 'title',
      right: 'heMonth,heWeek,heDay'
    },

    customButtons: {
      todayButton: {
        text: 'היום',
        click: () => this.goToToday()
      },
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

    locale: 'he',
    timeZone: 'local',
    direction: 'rtl',
    firstDay: 0,

    nowIndicator: true,
    dayHeaders: true,

    dayHeaderContent: (args) => {
      let dayName = args.text.replace(/\d+/g, '').trim();
      if (dayName.endsWith('.')) {
        dayName = dayName.slice(0, -1).trim();
      }
      // במצב מיני ותצוגת חודש - הצג רק אותיות (א, ב, ג, ...)
      if (this.miniCalendar && this.selectedView === 'month') {
        return {
          html: `<div class="fc-custom-header"><div class="fc-custom-day">${dayName}</div></div>`
        };
      }
      // בשאר המצבים - הצג גם מספר
      const dayNumber = args.date.getDate();
      return {
        html: `
          <div class="fc-custom-header">
            <div class="fc-custom-day">${dayName}</div>
            <div class="fc-custom-date">${dayNumber}</div>
          </div>
        `
      };
    },

    events: [],

    dateClick: (arg) => this.onDateClick(arg),

    eventContent: (arg) => {
      const therapistName =
        arg.event.extendedProps && arg.event.extendedProps['therapist_name'];

      const displayTitle = therapistName || arg.event.title;

      return {
        html: `
          <div class="custom-event">
            <span class="custom-event-text">${displayTitle}</span>
          </div>
        `
      };
    }
  };

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    private dialog?: MatDialog
  ) {
    if (data?.events) {
      this.events = data.events;
      this.calendarOptions.events = this.events;
    }
  }

  selectedView: string = 'month';

  ngOnInit(): void {
    // אם זה מצב מיני, אלץ תצוגת חודש והסתר toolbar
    if (this.miniCalendar) {
      this.calendarOptions = {
        ...this.calendarOptions,
        initialView: 'dayGridMonth',
        headerToolbar: false,
        dayHeaderFormat: { weekday: 'narrow' }
      };
    }
  }

  onViewChange(view: string): void {
    this.selectedView = view;
    let viewName = '';
    
    switch(view) {
      case 'month':
        viewName = 'dayGridMonth';
        break;
      case 'week':
        viewName = 'timeGridWeek';
        break;
      case 'day':
        viewName = 'timeGridDay';
        break;
    }
    
    this.changeView(viewName);
  }

  getCurrentMonthYear(): string {
    if (this.calendarComponent?.getApi) {
      const currentDate = this.calendarComponent.getApi().getDate();
      return currentDate.toLocaleDateString('he-IL', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events
      };

      if (this.calendarComponent?.getApi) {
        const api = this.calendarComponent.getApi();
        api.removeAllEvents();
        api.addEventSource(this.events);
      }
    }
  }

  goToToday() {
    if (this.calendarComponent?.getApi) {
      this.calendarComponent.getApi().changeView('timeGridDay', new Date());
    }
  }

  changeView(viewName: string) {
    if (this.calendarComponent?.getApi) {
      this.calendarComponent.getApi().changeView(viewName);
    }
  }

  onDateClick(arg: any) {
    // אל תפתח דיאלוג במצב מיני
    if (this.miniCalendar) {
      return;
    }

    const dateTime = arg.dateStr;
    const [date, timeRaw] = dateTime.split('T');

    let startTime = '';
    if (timeRaw) {
      const match = timeRaw.match(/^(\d{2}:\d{2})/);
      startTime = match ? match[1] : '';
    }

    this.openAddMeetingDialog(date, startTime);
    this.dateSelected.emit(arg);
  }

  openAddMeetingDialog(date?: string, startTime?: string) {
    if (this.dialog) {
      this.dialog.open(AddAppointmentDialogComponent, {
        width: '700px',
        data: {
          ...(date ? { date } : {}),
          ...(startTime ? { startTime } : {})
        }
      });
    }
  }
}