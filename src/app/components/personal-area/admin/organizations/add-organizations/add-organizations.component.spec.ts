import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrganizationsComponent } from './add-organizations.component';

describe('AddOrganizationsComponent', () => {
  let component: AddOrganizationsComponent;
  let fixture: ComponentFixture<AddOrganizationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrganizationsComponent]
    });
    fixture = TestBed.createComponent(AddOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
