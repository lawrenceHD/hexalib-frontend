import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieDepenseList } from './categorie-depense-list';

describe('CategorieDepenseList', () => {
  let component: CategorieDepenseList;
  let fixture: ComponentFixture<CategorieDepenseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieDepenseList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieDepenseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
