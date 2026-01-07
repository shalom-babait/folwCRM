import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistSettingsViewComponent } from './therapist-settings-view.component';

describe('TherapistSettingsViewComponent', () => {
  let component: TherapistSettingsViewComponent;
  let fixture: ComponentFixture<TherapistSettingsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TherapistSettingsViewComponent]
    });
    fixture = TestBed.createComponent(TherapistSettingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
