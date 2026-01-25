import { MatDialog } from '@angular/material/dialog';
import { Component, Input, Output, EventEmitter, SimpleChanges, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AddAppointmentDialogComponent } from '../../../patient/add-appointment-dialog/add-appointment-dialog.component';

@Component({
	selector: 'app-display-calendar',
	templateUrl: './display-calendar.component.html',
	styleUrls: ['./display-calendar.component.css']
})
export class DisplayCalendarComponent implements OnInit {

	@ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;
	@Input() roomId?: number;
	@Input() events: any[] = [];
	@Output() dateSelected = new EventEmitter<any>();
	@Input() miniCalendar: boolean = false;

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
		events: [],
		dateClick: (arg) => this.onDateClick(arg),
		locale: 'he',
		timeZone: 'local',
		direction: 'rtl',
		dayHeaders: true,
		firstDay: 0,
		nowIndicator: true,
		eventContent: function(arg) {
			const therapistName = arg.event.extendedProps && arg.event.extendedProps['therapist_name'];
			const displayTitle = therapistName || arg.event.title;
			return {
				html: `<div class='custom-event'><span class='custom-event-text'>${displayTitle}</span></div>`
			};
		}
	};

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

	goToToday() {
		if (this.calendarComponent && this.calendarComponent.getApi) {
			const api = this.calendarComponent.getApi();
			api.changeView('timeGridDay', new Date());
		}
	}

	changeView(viewName: string) {
		if (this.calendarComponent && this.calendarComponent.getApi) {
			this.calendarComponent.getApi().changeView(viewName);
		}
	}

	constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
		private dialog?: MatDialog
	) {
		if (data) {
			if (data.events) {
				this.events = data.events;
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
		// if (clickedDate < today) {
		//   alert('תאריך זה חלף / לא ניתן לקבוע פגישה חדשה');
		//   return;
		// }
		// חילוץ תאריך ושעה
		const dateTime = arg.dateStr;
		const [date, timeRaw] = dateTime.split('T');
		let startTime = '';
		if (timeRaw) {
			const match = timeRaw.match(/^(\d{2}:\d{2})/);
			startTime = match ? match[1] : '';
			console.log('השעה שנלחצה:', startTime);
		}
		this.openAddMeetingDialog(date, startTime);
		this.dateSelected.emit(arg);
	}
}