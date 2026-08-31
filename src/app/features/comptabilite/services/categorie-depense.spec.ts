import { TestBed } from '@angular/core/testing';

import { CategorieDepense } from './categorie-depense';

describe('CategorieDepense', () => {
  let service: CategorieDepense;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieDepense);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
