import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTherapistDialogComponent } from './add-therapist-dialog.component';

describe('AddTherapistDialogComponent', () => {
  let component: AddTherapistDialogComponent;
  let fixture: ComponentFixture<AddTherapistDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTherapistDialogComponent]
    });
    fixture = TestBed.createComponent(AddTherapistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
