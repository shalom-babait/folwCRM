import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TherapistCreationData } from '../models/therapist.model';

@Injectable({ providedIn: 'root' })
export class TherapistSessionService {
  private therapistSubject = new BehaviorSubject<TherapistCreationData | null>(null);
  therapist$ = this.therapistSubject.asObservable();

  setTherapist(therapist: TherapistCreationData) {
    this.therapistSubject.next(therapist);
  }

  getTherapist(): TherapistCreationData | null {
    return this.therapistSubject.value;
  }


  getTherapistId(): number | undefined {
    return this.therapistSubject.value?.therapist?.therapist_id;
  }
 
  clearTherapist() {
    this.therapistSubject.next(null);
  }
}
