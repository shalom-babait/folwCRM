import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-unsaved-dialog',
  templateUrl: './confirm-unsaved-dialog.component.html',
  styleUrls: ['./confirm-unsaved-dialog.component.css',
             '../../styles/dialog-forms.css'
  ]
})
export class ConfirmUnsavedDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmUnsavedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onSave(): void {
    this.dialogRef.close('save');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
