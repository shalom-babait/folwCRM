import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TreatmentType } from 'src/app/models/treatment-type.model';
import { TreatmentTypesService } from 'src/app/services/treatment-types.service';

@Component({
  selector: 'app-treatment-type-details',
  templateUrl: './treatment-type-details.component.html',
  styleUrls: ['./treatment-type-details.component.css',
    '../../../../../styles/report-view.css'
  ]
})
export class TreatmentTypeDetailsComponent implements OnInit, OnDestroy {
  treatmentType: TreatmentType | null = null;
  isEditing = false;
  treatmentTypeForm: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private treatmentTypesService: TreatmentTypesService
  ) {
    this.treatmentTypeForm = this.fb.group({
      type_name: ['', [Validators.required, Validators.minLength(2)]],
      type_description: [''],
      price_default: [''],
      color: ['#2196F3']
    });
  }

  ngOnInit(): void {
    // האזנה לשינויים ב-state
    this.subscription.add(
      this.treatmentTypesService.selectedTreatmentType$.subscribe(type => {
        this.treatmentType = type;
        this.isEditing = false;
        if (type) {
          this.updateForm();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateForm(): void {
    if (this.treatmentType) {
      this.treatmentTypeForm.patchValue({
        type_name: this.treatmentType.type_name,
        type_description: this.treatmentType.type_description || '',
        price_default: this.treatmentType.price_default || '',
        color: this.treatmentType.color || '#2196F3'
      }, { emitEvent: false });
    }
  }

  startEdit(): void {
    this.isEditing = true;
    this.updateForm();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.updateForm();
  }

  saveChanges(): void {
    if (this.treatmentTypeForm.valid && this.treatmentType) {
      const updatedType: TreatmentType = {
        ...this.treatmentType,
        ...this.treatmentTypeForm.value
      };

      this.treatmentTypesService.updateTreatmentType(updatedType).subscribe({
        next: (response) => {
          if (response.success) {
            alert('סוג הטיפול עודכן בהצלחה');
            this.isEditing = false;
            // ה-state יתעדכן אוטומטית דרך ה-service
          }
        },
        error: (err) => {
          console.error('Error updating treatment type:', err);
          alert('שגיאה בעדכון סוג הטיפול');
        }
      });
    }
  }
}
