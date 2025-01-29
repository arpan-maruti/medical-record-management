import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSubcaseComponent } from './upload-subcase.component';

describe('UploadSubcaseComponent', () => {
  let component: UploadSubcaseComponent;
  let fixture: ComponentFixture<UploadSubcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadSubcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSubcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
