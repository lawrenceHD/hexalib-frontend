import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointVente } from './point-vente';

describe('PointVente', () => {
  let component: PointVente;
  let fixture: ComponentFixture<PointVente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointVente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointVente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
