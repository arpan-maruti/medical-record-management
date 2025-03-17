import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutDialogueComponent } from './logout-dialogue.component';

describe('LogoutDialogueComponent', () => {
  let component: LogoutDialogueComponent;
  let fixture: ComponentFixture<LogoutDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
