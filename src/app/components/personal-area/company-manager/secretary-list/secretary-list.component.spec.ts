import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryListComponent } from './secretary-list.component';

describe('SecretaryListComponent', () => {
  let component: SecretaryListComponent;
  let fixture: ComponentFixture<SecretaryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretaryListComponent]
    });
    fixture = TestBed.createComponent(SecretaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
