import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-add-room-dialog',
  templateUrl: './add-room-dialog.component.html',
  styleUrls: ['./add-room-dialog.component.css', '../../../../../styles/dialog-forms.css']
})
export class AddRoomDialogComponent {
  roomForm: FormGroup;
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<AddRoomDialogComponent>,
    private fb: FormBuilder,
    private roomsService: RoomsService
  ) {
    this.roomForm = this.fb.group({
      room_name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.roomForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const room = {
        room_id: 0, // Backend should assign the ID
        room_name: this.roomForm.value.room_name
      };

      this.roomsService.addRoom({ room }).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding room:', error);
        }
      });
    }
  }
}
