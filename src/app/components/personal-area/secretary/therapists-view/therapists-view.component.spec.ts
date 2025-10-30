import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistsViewComponent } from './therapists-view.component';

describe('TherapistsViewComponent', () => {
  let component: TherapistsViewComponent;
  let fixture: ComponentFixture<TherapistsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TherapistsViewComponent]
    });
    fixture = TestBed.createComponent(TherapistsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
