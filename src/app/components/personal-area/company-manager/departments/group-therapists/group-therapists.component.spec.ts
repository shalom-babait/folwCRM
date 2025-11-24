import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTherapistsComponent } from './group-therapists.component';

describe('GroupTherapistsComponent', () => {
  let component: GroupTherapistsComponent;
  let fixture: ComponentFixture<GroupTherapistsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupTherapistsComponent]
    });
    fixture = TestBed.createComponent(GroupTherapistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
