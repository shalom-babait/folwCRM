import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsGroupViewComponent } from './departments-groups-view.component';

describe('DepartmentsGroupViewComponent', () => {
  let component: DepartmentsGroupViewComponent;
  let fixture: ComponentFixture<DepartmentsGroupViewComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentsGroupViewComponent]
    });
    fixture = TestBed.createComponent(DepartmentsGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
