import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBaseComponent } from './chart-base.component';

describe('ChartBaseComponent', () => {
  let component: ChartBaseComponent;
  let fixture: ComponentFixture<ChartBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartBaseComponent]
    });
    fixture = TestBed.createComponent(ChartBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
