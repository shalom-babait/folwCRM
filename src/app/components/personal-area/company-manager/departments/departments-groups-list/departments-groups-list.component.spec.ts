import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsGroupsListComponent } from './departments-groups-list.component';

describe('DepartmentsGroupsListComponent', () => {
  let component: DepartmentsGroupsListComponent;
  let fixture: ComponentFixture<DepartmentsGroupsListComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentsGroupsListComponent]
    });
    fixture = TestBed.createComponent(DepartmentsGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
