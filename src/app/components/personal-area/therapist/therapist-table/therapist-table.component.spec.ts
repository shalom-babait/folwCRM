import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistTableComponent } from './therapist-table.component';

describe('TherapistTableComponent', () => {
  let component: TherapistTableComponent;
  let fixture: ComponentFixture<TherapistTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TherapistTableComponent]
    });
    fixture = TestBed.createComponent(TherapistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
