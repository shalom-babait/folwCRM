import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientProblemRatingComponent } from './add-patient-problem-rating.component';

describe('AddPatientProblemRatingComponent', () => {
  let component: AddPatientProblemRatingComponent;
  let fixture: ComponentFixture<AddPatientProblemRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPatientProblemRatingComponent]
    });
    fixture = TestBed.createComponent(AddPatientProblemRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
