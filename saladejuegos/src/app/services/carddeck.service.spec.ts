import { TestBed } from '@angular/core/testing';

import { CarddeckService } from './carddeck.service';

describe('CarddeckService', () => {
  let service: CarddeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarddeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
