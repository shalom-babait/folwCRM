import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointmentDialogComponent } from './add-appointment-dialog.component';

describe('AddAppointmentDialogComponent', () => {
  let component: AddAppointmentDialogComponent;
  let fixture: ComponentFixture<AddAppointmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAppointmentDialogComponent]
    });
    fixture = TestBed.createComponent(AddAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
  expect(component).toBeTruthy();
  });
});
