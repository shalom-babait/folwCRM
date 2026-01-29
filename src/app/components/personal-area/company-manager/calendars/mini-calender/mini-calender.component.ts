import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-calender',
  templateUrl: './mini-calender.component.html',
  styleUrls: ['./mini-calender.component.css']
})
export class MiniCalenderComponent {
  @Input() events: any[] = [];
}
