import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TherapistService } from 'src/app/services/therapist.service';

@Component({
  selector: 'app-add-treatment-type-dialog',
  templateUrl: './add-treatment-type-dialog.component.html',
  styleUrls: ['./add-treatment-type-dialog.component.css', '../../../../../styles/dialog-forms.css']
})
export class AddTreatmentTypeDialogComponent implements OnInit {
  treatmentTypeForm: FormGroup;
  isSubmitting = false;
  therapists: any[] = [];
  showTherapistSelect: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddTreatmentTypeDialogComponent>,
    private fb: FormBuilder,
    private therapistService: TherapistService,
    @Inject(MAT_DIALOG_DATA) public data: { therapistId: number | null, userRole: string | null }
  ) {
    this.showTherapistSelect = !data.therapistId && data.userRole === 'manager';
    
    this.treatmentTypeForm = this.fb.group({
      type_name: ['', [Validators.required, Validators.minLength(2)]],
      type_description: [''],
      therapist_id: [data.therapistId || '', this.showTherapistSelect ? [Validators.required] : []],
      price_default: [null],
      color: ['#2196f3']
    });
  }

  ngOnInit(): void {
    if (this.showTherapistSelect) {
      this.loadTherapists();
    }
  }

  loadTherapists(): void {
    this.therapistService.getAllTherapists().subscribe({
      next: (therapists) => {
        this.therapists = therapists;
      },
      error: (err) => {
        console.error('Error loading therapists:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.treatmentTypeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const therapistId = this.showTherapistSelect 
        ? this.treatmentTypeForm.value.therapist_id 
        : this.data.therapistId;


      const treatmentType = {
        type_name: this.treatmentTypeForm.value.type_name,
        type_description: this.treatmentTypeForm.value.type_description || '',
        therapist_id: therapistId,
        price_default: this.treatmentTypeForm.value.price_default,
        color: this.treatmentTypeForm.value.color
      };

      this.dialogRef.close(treatmentType);
    }
  }
}
