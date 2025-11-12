import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.css'
    , '../../../../../styles/dialog-forms.css'
  ]
})
export class AddGroupDialogComponent {
  groupForm: FormGroup;
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<AddGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { department: any },
    private fb: FormBuilder,
    private groupService: GroupsService
  ) {
    this.groupForm = this.fb.group({
      group_name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.groupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const newGroup = {
        group_name: this.groupForm.value.group_name,
        department_id: this.data.department.department_id
      };

      this.groupService.addGroup(newGroup).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding group:', error);
          // כאן אפשר להוסיף הודעת שגיאה למשתמש
        }
      });
    }
  }
}
