import { TestBed } from '@angular/core/testing';

import { CalculationConfigService } from './calculation-config.service';

describe('CalculationConfigService', () => {
  let service: CalculationConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculationConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
