import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentGroupSelectorComponent } from './department-group-selector.component';

describe('DepartmentGroupSelectorComponent', () => {
  let component: DepartmentGroupSelectorComponent;
  let fixture: ComponentFixture<DepartmentGroupSelectorComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentGroupSelectorComponent]
    });
    fixture = TestBed.createComponent(DepartmentGroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
