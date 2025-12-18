import { Pipe, PipeTransform } from '@angular/core';
import { PatientCreationData } from 'src/app/models/patient.model';

@Pipe({ name: 'patientNameFilter' })
export class PatientNameFilterPipe implements PipeTransform {
  transform(patients: PatientCreationData[], searchText: string): PatientCreationData[] {
    if (!searchText) return patients;
    const lower = searchText.toLowerCase();
    return patients.filter(p => {
      const first = (p.person.first_name || '').toLowerCase();
      const last = (p.person.last_name || '').toLowerCase();
      return first.includes(lower) || last.includes(lower) || (`${first} ${last}`).includes(lower);
    });
  }
}
