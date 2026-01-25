import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialVideosComponent } from './tutorial-videos.component';

describe('TutorialVideosComponent', () => {
  let component: TutorialVideosComponent;
  let fixture: ComponentFixture<TutorialVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TutorialVideosComponent]
    });
    fixture = TestBed.createComponent(TutorialVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
