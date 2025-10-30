import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyManagerHeaderComponent } from './company-manager-header.component';

describe('CompanyManagerHeaderComponent', () => {
  let component: CompanyManagerHeaderComponent;
  let fixture: ComponentFixture<CompanyManagerHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyManagerHeaderComponent]
    });
    fixture = TestBed.createComponent(CompanyManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
