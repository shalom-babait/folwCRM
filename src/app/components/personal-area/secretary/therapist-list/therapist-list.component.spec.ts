import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistListComponent } from './therapist-list.component';

describe('TherapistListComponent', () => {
  let component: TherapistListComponent;
  let fixture: ComponentFixture<TherapistListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TherapistListComponent]
    });
    fixture = TestBed.createComponent(TherapistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
