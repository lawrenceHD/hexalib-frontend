import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportPeriodique } from './rapport-periodique';

describe('RapportPeriodique', () => {
  let component: RapportPeriodique;
  let fixture: ComponentFixture<RapportPeriodique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportPeriodique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportPeriodique);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
