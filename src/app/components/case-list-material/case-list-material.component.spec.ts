import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseListMaterialComponent } from './case-list-material.component';

describe('CaseListMaterialComponent', () => {
  let component: CaseListMaterialComponent;
  let fixture: ComponentFixture<CaseListMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseListMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseListMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
