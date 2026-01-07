import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistSettingsMenuComponent } from './therapist-settings-menu.component';

describe('TherapistSettingsMenuComponent', () => {
  let component: TherapistSettingsMenuComponent;
  let fixture: ComponentFixture<TherapistSettingsMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TherapistSettingsMenuComponent]
    });
    fixture = TestBed.createComponent(TherapistSettingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
