import { TestBed } from '@angular/core/testing';

import { PhoneMaskService } from './services/phone-mask.service';

describe('PhoneMaskService', () => {
  let service: PhoneMaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneMaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
