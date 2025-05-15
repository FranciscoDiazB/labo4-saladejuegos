import { TestBed } from '@angular/core/testing';

import { MmobombService } from './mmobomb.service';

describe('MmobombService', () => {
  let service: MmobombService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MmobombService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
