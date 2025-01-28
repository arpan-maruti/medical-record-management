import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNewCaseComponent } from './upload-new-case.component';

describe('UploadNewCaseComponent', () => {
  let component: UploadNewCaseComponent;
  let fixture: ComponentFixture<UploadNewCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadNewCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadNewCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
