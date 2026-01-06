import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientProblemTableComponent } from './patient-problem-table.component';

describe('PatientProblemTableComponent', () => {
  let component: PatientProblemTableComponent;
  let fixture: ComponentFixture<PatientProblemTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientProblemTableComponent]
    });
    fixture = TestBed.createComponent(PatientProblemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
