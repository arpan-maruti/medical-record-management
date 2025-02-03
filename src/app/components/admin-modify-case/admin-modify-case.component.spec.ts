import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModifyCaseComponent } from './admin-modify-case.component';

describe('AdminModifyCaseComponent', () => {
  let component: AdminModifyCaseComponent;
  let fixture: ComponentFixture<AdminModifyCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModifyCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminModifyCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
