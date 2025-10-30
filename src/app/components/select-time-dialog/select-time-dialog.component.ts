import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-time-dialog',
  templateUrl: './select-time-dialog.component.html',
  styleUrls: ['./select-time-dialog.component.css']
})
export class SelectTimeDialogComponent {
  @Input() roomEvents: any[] = [];
  conflictError: string = '';
  timeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SelectTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: string, roomEvents?: any[] }
  ) {
    this.timeForm = this.fb.group({
      startTime: ['', [Validators.required, Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^([0-1]?\d|2[0-3]):[0-5]\d$/)]]
    });
    if (data.roomEvents) {
      this.roomEvents = data.roomEvents;
    }
  }

  save() {
    if (this.timeForm.valid) {
      // בדיקת תפוסה
      if (this.roomEvents && this.roomEvents.length > 0) {
        const selectedDate = this.data.date ? this.data.date.split('T')[0] : null;
        const overlap = this.roomEvents.some(ev => {
          const evDate = ev.start.split('T')[0];
          if (evDate !== selectedDate) return false;
          const evStart = ev.start.split('T')[1];
          const evEnd = ev.end.split('T')[1];
          return (this.timeForm.value.startTime < evEnd && this.timeForm.value.endTime > evStart);
        });
        if (overlap) {
          this.conflictError = 'השעה שבחרת תפוסה בחדר זה. אנא בחר שעה אחרת.';
          return;
        } else {
          this.conflictError = '';
        }
      }
      this.dialogRef.close(this.timeForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
