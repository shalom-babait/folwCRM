import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnChanges {

  private getBirthDate(): string | undefined {
    // עדיפות ל-user, אם לא קיים ניקח מה-patient
    return this.patient?.person?.birth_date || this.patient?.patient?.person?.birth_date;
  }
  private formatDateForInput(dateString?: string): string {
    if (!dateString) return '';
    // תומך בפורמטים עם שעה או תאריך מלא
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  @Input() patient!: PatientCreationData;
  @Output() patientUpdated = new EventEmitter<PatientCreationData>();
  isEditing = false;
  patientForm: FormGroup;
  @Input() openInEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.patientForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      phone: [''],
      email: ['', [Validators.email]],
      birth_date: [''],
      address: ['']
    });
  }
  ngOnChanges(): void {

    // אם צריך לפתוח ישירות לעריכה
    if (this.openInEditMode) {
      this.startEdit();
    } else {
      this.isEditing = false;
    }

    // טוען נתונים לטופס
    if (this.patient && this.patientForm && this.patient.person) {
      this.patientForm.patchValue({
        first_name: this.patient.person.first_name,
        last_name: this.patient.person.last_name,
        phone: this.patient.person.phone,
        email: this.patient.person.email || '',
        birth_date: this.formatDateForInput(this.getBirthDate()),
        address: this.patient.person.address
      }, { emitEvent: false });
    }
  }

  startEdit(): void {
    this.isEditing = true;
    if (this.patient && this.patient.person) {
      this.patientForm.patchValue({
        first_name: this.patient.person.first_name,
        last_name: this.patient.person.last_name,
        phone: this.patient.person.phone,
        email: this.patient.person.email || '',
        birth_date: this.formatDateForInput(this.getBirthDate()),
        address: this.patient.person.address
      }, { emitEvent: false });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.patient && this.patient.person) {
      this.patientForm.patchValue({
        first_name: this.patient.person.first_name,
        last_name: this.patient.person.last_name,
        phone: this.patient.person.phone,
        email: this.patient.person.email || '',
        birth_date: this.formatDateForInput(this.getBirthDate()),
        address: this.patient.person.address
      }, { emitEvent: false });
    }
  }

 saveChanges(): void {
  if (this.patientForm.valid) {
    const updatedPatient: PatientCreationData = {
      ...this.patient,
      person: {
        ...this.patient.person,
        ...this.patientForm.value
      },
      patient: {
        ...this.patient.patient,
        ...this.patientForm.value
      }
    };
    // הסר email מהאובייקט אם קיים
    if ('email' in updatedPatient.person) {
      delete updatedPatient.person.email;
    }
    this.patientUpdated.emit(updatedPatient);
    this.isEditing = false;
  }
}
  calculateAge(): number {
    const birthDateStr = this.getBirthDate();
    if (!birthDateStr) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

