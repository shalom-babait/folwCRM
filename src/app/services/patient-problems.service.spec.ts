import { TestBed } from '@angular/core/testing';

import { PatientProblemsService } from './patient-problems.service';

describe('PatientProblemsService', () => {
  let service: PatientProblemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientProblemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
