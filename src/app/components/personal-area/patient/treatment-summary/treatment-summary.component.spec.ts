import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentSummaryComponent } from './treatment-summary.component';

describe('TreatmentSummaryComponent', () => {
  let component: TreatmentSummaryComponent;
  let fixture: ComponentFixture<TreatmentSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreatmentSummaryComponent]
    });
    fixture = TestBed.createComponent(TreatmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
