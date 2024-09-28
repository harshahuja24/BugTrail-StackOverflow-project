import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllQuestComponent } from './view-all-quest.component';

describe('ViewAllQuestComponent', () => {
  let component: ViewAllQuestComponent;
  let fixture: ComponentFixture<ViewAllQuestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAllQuestComponent]
    });
    fixture = TestBed.createComponent(ViewAllQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
