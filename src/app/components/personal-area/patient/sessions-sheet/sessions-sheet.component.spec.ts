import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsSheetComponent } from './sessions-sheet.component';

describe('SessionsSheetComponent', () => {
  let component: SessionsSheetComponent;
  let fixture: ComponentFixture<SessionsSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionsSheetComponent]
    });
    fixture = TestBed.createComponent(SessionsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
