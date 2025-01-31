import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAndLabelComponent } from './view-and-label.component';

describe('ViewAndLabelComponent', () => {
  let component: ViewAndLabelComponent;
  let fixture: ComponentFixture<ViewAndLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAndLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAndLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
