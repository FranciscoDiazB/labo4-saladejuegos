import { TestBed } from '@angular/core/testing';

import { WordgeneratorService } from './wordgenerator.service';

describe('WordgeneratorService', () => {
  let service: WordgeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordgeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
