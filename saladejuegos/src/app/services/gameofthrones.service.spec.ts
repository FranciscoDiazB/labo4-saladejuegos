import { TestBed } from '@angular/core/testing';

import { GameofthronesService } from './gameofthrones.service';

describe('GameofthronesService', () => {
  let service: GameofthronesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameofthronesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
