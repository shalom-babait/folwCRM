import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSelectorComponent } from './department-selector.component';

describe('DepartmentSelectorComponent', () => {
  let component: DepartmentSelectorComponent;
  let fixture: ComponentFixture<DepartmentSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentSelectorComponent]
    });
    fixture = TestBed.createComponent(DepartmentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
