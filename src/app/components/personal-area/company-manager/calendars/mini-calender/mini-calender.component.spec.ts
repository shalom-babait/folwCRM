import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCalenderComponent } from './mini-calender.component';

describe('MiniCalenderComponent', () => {
  let component: MiniCalenderComponent;
  let fixture: ComponentFixture<MiniCalenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniCalenderComponent]
    });
    fixture = TestBed.createComponent(MiniCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
