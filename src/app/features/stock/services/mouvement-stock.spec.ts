import { TestBed } from '@angular/core/testing';

import { MouvementStock } from './mouvement-stock';

describe('MouvementStock', () => {
  let service: MouvementStock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouvementStock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
