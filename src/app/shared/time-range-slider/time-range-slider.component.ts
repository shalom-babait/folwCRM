import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Options, ChangeContext } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-time-range-slider',
  templateUrl: './time-range-slider.component.html',
  styleUrls: ['./time-range-slider.component.css']
})
export class TimeRangeSliderComponent {
  @Input() minDate: Date = new Date(new Date().getFullYear(), 0, 1);
  @Input() maxDate: Date = new Date();
  @Input() startDate: Date = new Date(new Date().getFullYear(), 0, 1);
  @Input() endDate: Date = new Date();
  @Output() rangeChange = new EventEmitter<{start: Date, end: Date}>();
  @Output() rangeRelease = new EventEmitter<{start: Date, end: Date}>();


  // Internal state for slider (number of days since minDate)
  get minValue() { return 0; }
  get maxValue() { return this.dateDiff(this.minDate, this.maxDate); }
  get value() {
    return this.dateDiff(this.minDate, this.startDate);
  }
  get highValue() {
    return this.dateDiff(this.minDate, this.endDate);
  }
  get options(): Options {
    return {
      floor: this.minValue,
      ceil: this.maxValue,
      step: 1,
      pushRange: true
    };
  }

  onSliderChange(change: ChangeContext) {
    const newStart = this.addDays(this.minDate, change.value);
    const newEnd = this.addDays(this.minDate, change.highValue!);
    this.rangeChange.emit({ start: newStart, end: newEnd });
  }

  onSliderRelease(change: ChangeContext) {
    const newStart = this.addDays(this.minDate, change.value);
    const newEnd = this.addDays(this.minDate, change.highValue!);
    this.rangeRelease.emit({ start: newStart, end: newEnd });
  }

  dateDiff(a: Date, b: Date) {
    return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  }
  addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
}
