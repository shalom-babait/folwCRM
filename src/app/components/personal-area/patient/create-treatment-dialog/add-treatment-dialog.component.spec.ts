import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTreatmentDialogComponent } from './add-treatment-dialog.component';

describe('CreateTreatmentDialogComponent', () => {
  let component: CreateTreatmentDialogComponent;
  let fixture: ComponentFixture<CreateTreatmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTreatmentDialogComponent]
    });
    fixture = TestBed.createComponent(CreateTreatmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
