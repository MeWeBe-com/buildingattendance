import { TestBed } from '@angular/core/testing';

import { WebguardService } from './webguard.service';

describe('WebguardService', () => {
  let service: WebguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
