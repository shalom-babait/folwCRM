import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentTypeViewComponent } from './treatment-type-view.component';

describe('TreatmentTypeViewComponent', () => {
  let component: TreatmentTypeViewComponent;
  let fixture: ComponentFixture<TreatmentTypeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreatmentTypeViewComponent]
    });
    fixture = TestBed.createComponent(TreatmentTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
