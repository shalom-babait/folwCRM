import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistReportsComponent } from './therapist-reports.component';

describe('TherapistReportsComponent', () => {
  let component: TherapistReportsComponent;
  let fixture: ComponentFixture<TherapistReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TherapistReportsComponent]
    });
    fixture = TestBed.createComponent(TherapistReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
