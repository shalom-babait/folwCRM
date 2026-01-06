import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientProblemComponent } from './add-patient-problem.component';

describe('AddPatientProblemComponent', () => {
  let component: AddPatientProblemComponent;
  let fixture: ComponentFixture<AddPatientProblemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPatientProblemComponent]
    });
    fixture = TestBed.createComponent(AddPatientProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
