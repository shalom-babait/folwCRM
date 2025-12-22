import { TestBed } from '@angular/core/testing';

import { ApppointmentService } from './apppointment.service';

describe('ApppointmentService', () => {
  let service: ApppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
