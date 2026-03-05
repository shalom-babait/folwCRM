import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReportsComponent } from './appointment-reports.component';

describe('AppointmentReportsComponent', () => {
  let component: AppointmentReportsComponent;
  let fixture: ComponentFixture<AppointmentReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentReportsComponent]
    });
    fixture = TestBed.createComponent(AppointmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
