import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectViewComponent } from './prospect-view.component';

describe('ProspectViewComponent', () => {
  let component: ProspectViewComponent;
  let fixture: ComponentFixture<ProspectViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectViewComponent]
    });
    fixture = TestBed.createComponent(ProspectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
