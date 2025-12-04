import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFollowUpTableComponent } from './user-follow-up-table.component';

describe('UserFollowUpTableComponent', () => {
  let component: UserFollowUpTableComponent;
  let fixture: ComponentFixture<UserFollowUpTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserFollowUpTableComponent]
    });
    fixture = TestBed.createComponent(UserFollowUpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
