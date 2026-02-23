import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistCalendarFilterMenuComponent } from './therapist-calendar-filter-menu.component';

describe('TherapistCalendarFilterMenuComponent', () => {
  let component: TherapistCalendarFilterMenuComponent;
  let fixture: ComponentFixture<TherapistCalendarFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapistCalendarFilterMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistCalendarFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
