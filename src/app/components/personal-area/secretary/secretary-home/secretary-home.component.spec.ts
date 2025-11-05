import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryHomeComponent } from './secretary-home.component';

describe('SecretaryHomeComponent', () => {
  let component: SecretaryHomeComponent;
  let fixture: ComponentFixture<SecretaryHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretaryHomeComponent]
    });
    fixture = TestBed.createComponent(SecretaryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
