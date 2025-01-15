import { TestBed } from '@angular/core/testing';
import { MonthlyDataService } from './monthly-data.service';


describe('MonthlyDataService', () => {
  let service: MonthlyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
