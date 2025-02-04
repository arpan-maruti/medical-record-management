import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwaggerViewerComponent } from './swagger-viewer.component';

describe('SwaggerViewerComponent', () => {
  let component: SwaggerViewerComponent;
  let fixture: ComponentFixture<SwaggerViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwaggerViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwaggerViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
