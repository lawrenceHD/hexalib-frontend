import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportSelector } from './rapport-selector';

describe('RapportSelector', () => {
  let component: RapportSelector;
  let fixture: ComponentFixture<RapportSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
