import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurList } from './fournisseur-list';

describe('FournisseurList', () => {
  let component: FournisseurList;
  let fixture: ComponentFixture<FournisseurList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FournisseurList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FournisseurList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
