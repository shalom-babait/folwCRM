import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectTableComponent } from './prospect-table.component';

describe('ProspectTableComponent', () => {
  let component: ProspectTableComponent;
  let fixture: ComponentFixture<ProspectTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectTableComponent]
    });
    fixture = TestBed.createComponent(ProspectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
