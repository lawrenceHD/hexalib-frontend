import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportVentes } from './rapport-ventes';

describe('RapportVentes', () => {
  let component: RapportVentes;
  let fixture: ComponentFixture<RapportVentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportVentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportVentes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
