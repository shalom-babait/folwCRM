import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientProblemRatingListComponent } from './patient-problem-rating-list.component';

describe('PatientProblemRatingListComponent', () => {
  let component: PatientProblemRatingListComponent;
  let fixture: ComponentFixture<PatientProblemRatingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientProblemRatingListComponent]
    });
    fixture = TestBed.createComponent(PatientProblemRatingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
