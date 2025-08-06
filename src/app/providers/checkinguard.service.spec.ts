import { TestBed } from '@angular/core/testing';

import { CheckinguardService } from './checkinguard.service';

describe('CheckinguardService', () => {
  let service: CheckinguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckinguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
