import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistHomeSettingComponent } from './therapist-home-setting.component';

describe('TherapistHomeSettingComponent', () => {
  let component: TherapistHomeSettingComponent;
  let fixture: ComponentFixture<TherapistHomeSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TherapistHomeSettingComponent]
    });
    fixture = TestBed.createComponent(TherapistHomeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
