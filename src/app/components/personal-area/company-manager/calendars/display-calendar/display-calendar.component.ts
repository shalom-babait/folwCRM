import { MatDialog } from '@angular/material/dialog';
import { AddAppointmentDialogComponent } from '../../../patient/add-appointment-dialog/add-appointment-dialog.component'
import { Component, Input, Output, EventEmitter, SimpleChanges, Inject, OnInit, Optional, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';
import { ViewEncapsulation } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarStateService } from 'src/app/services/calendar-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-display-calendar',
	templateUrl: './display-calendar.component.html',
	styleUrls: ['./display-calendar.component.css'],
  encapsulation: ViewEncapsulation.None   // ⭐ חובה כדי שה-CSS ישפיע
})
export class DisplayCalendarComponent implements OnInit, AfterViewInit, OnDestroy {

 @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;

  @Input() roomId?: number;
  @Input() events: any[] = [];
  @Input() miniCalendar: boolean = false;

  @Output() dateSelected = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

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

    // סימון ליום הנבחר - גם ביומן קטן וגם ביומן גדול
    dayCellClassNames: (arg) => {
      if (this.calendarStateService) {
        const isSelected = this.calendarStateService.isDateSelected(arg.date);
        if (isSelected) {
          // ביומן קטן - סימון אחד, ביומן גדול - סימון אחר
          return this.miniCalendar ? ['fc-day-selected'] : ['fc-day-clicked'];
        }
      }
      return [];
    },

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

  selectedView: string = 'month';
  currentMonthYear: string = '';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    private dialog?: MatDialog,
    private cdr?: ChangeDetectorRef,
    private calendarStateService?: CalendarStateService
  ) {
    if (data?.events) {
      this.events = data.events;
      this.calendarOptions.events = this.events;
    }
  }

  ngOnInit(): void {
    // האזנה לשינויים בתאריך הנבחר - לעדכון הסימון ביומן
    if (this.calendarStateService) {
      this.calendarStateService.selectedDate$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // עדכן את התצוגה כשהתאריך הנבחר משתנה
          if (this.calendarComponent?.getApi) {
            setTimeout(() => {
              this.calendarComponent.getApi().render();
            }, 50);
          }
        });
    }

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


  ngAfterViewInit(): void {
    // עדכן את החודש והשנה פעם אחת אחרי שה-View נטען
    if (this.calendarComponent?.getApi) {
      const api = this.calendarComponent.getApi();
      const currentDate = api.getDate();
      
      this.currentMonthYear = currentDate.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long'
      });
      if (this.cdr) {
        this.cdr.detectChanges();
      }
      
      // נסה לרנדר מחדש
      setTimeout(() => {
        api.render();
      }, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
      // עדכן את calendarOptions עם האירועים החדשים
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events || []
      };

      if (this.calendarComponent?.getApi) {
        const api = this.calendarComponent.getApi();
        
        // אל תעדכן אם מגיע מערך ריק והיומן כבר מאותחל
        if (!this.events || this.events.length === 0) {
          return;
        }
        
        api.removeAllEventSources();
        
        api.addEventSource(this.events);
        
        // כפה render
        setTimeout(() => {
          api.render();
        }, 50);
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
    // במצב מיני - עדכן את ה-State
    if (this.miniCalendar) {
      const clickedDate = arg.date;
      if (this.calendarStateService) {
        this.calendarStateService.setSelectedDate(clickedDate);
      }
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

  /**
   * ניווט לתאריך ספציפי ביומן הראשי
   * התצוגה תישאר כפי שהיא (יום/שבוע/חודש)
   */
  navigateToDate(date: Date): void {
    if (this.calendarComponent?.getApi) {
      const api = this.calendarComponent.getApi();
      api.gotoDate(date);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}