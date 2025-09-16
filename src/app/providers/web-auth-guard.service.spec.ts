import { TestBed } from '@angular/core/testing';

import { WebAuthGuardService } from './web-auth-guard.service';

describe('WebAuthGuardService', () => {
  let service: WebAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
