import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportCompteResultat } from './rapport-compte-resultat';

describe('RapportCompteResultat', () => {
  let component: RapportCompteResultat;
  let fixture: ComponentFixture<RapportCompteResultat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportCompteResultat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportCompteResultat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
