import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFollowupDialogComponent } from './add-followup-dialog.component';

describe('AddFollowupDialogComponent', () => {
  let component: AddFollowupDialogComponent;
  let fixture: ComponentFixture<AddFollowupDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFollowupDialogComponent]
    });
    fixture = TestBed.createComponent(AddFollowupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
