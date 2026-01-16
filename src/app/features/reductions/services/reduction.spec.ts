import { TestBed } from '@angular/core/testing';

import { Reduction } from './reduction';

describe('Reduction', () => {
  let service: Reduction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reduction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
