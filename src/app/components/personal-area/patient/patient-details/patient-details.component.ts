import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from 'src/app/models/patient.model';
@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnChanges {
  @Input() patient!: Patient;
  @Output() patientUpdated = new EventEmitter<Patient>();

  isEditing = false;
  patientForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.patientForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      birth_date: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnChanges(): void {
    if (this.patient && this.patientForm) {
      this.patientForm.patchValue(this.patient);
    }
  }

  startEdit(): void {
    this.isEditing = true;
    this.patientForm.patchValue(this.patient);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.patientForm.patchValue(this.patient);
  }

  saveChanges(): void {
    if (this.patientForm.valid) {
      const updatedPatient: Patient = {
        ...this.patient,
        ...this.patientForm.value
      };
      this.patientUpdated.emit(updatedPatient);
      this.isEditing = false;
    }
  }

  calculateAge(): number {
  if (!this.patient?.birth_date) return 0;
    
    const today = new Date();
  const birthDate = new Date(this.patient.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  }
}
