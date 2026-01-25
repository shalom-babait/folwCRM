import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTreatmentTypeDialogComponent } from './add-treatment-type-dialog.component';

describe('AddTreatmentTypeDialogComponent', () => {
  let component: AddTreatmentTypeDialogComponent;
  let fixture: ComponentFixture<AddTreatmentTypeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTreatmentTypeDialogComponent]
    });
    fixture = TestBed.createComponent(AddTreatmentTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
