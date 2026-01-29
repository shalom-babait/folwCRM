import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderViewComponent } from './calender-view.component';

describe('CalenderViewComponent', () => {
  let component: CalenderViewComponent;
  let fixture: ComponentFixture<CalenderViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalenderViewComponent]
    });
    fixture = TestBed.createComponent(CalenderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
