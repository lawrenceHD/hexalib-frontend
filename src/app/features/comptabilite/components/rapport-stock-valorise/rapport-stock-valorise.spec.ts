import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportStockValorise } from './rapport-stock-valorise';

describe('RapportStockValorise', () => {
  let component: RapportStockValorise;
  let fixture: ComponentFixture<RapportStockValorise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportStockValorise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportStockValorise);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
