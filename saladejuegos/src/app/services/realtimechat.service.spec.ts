import { TestBed } from '@angular/core/testing';

import { RealtimechatService } from './realtimechat.service';

describe('RealtimechatService', () => {
  let service: RealtimechatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimechatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
