import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportTresorerie } from './rapport-tresorerie';

describe('RapportTresorerie', () => {
  let component: RapportTresorerie;
  let fixture: ComponentFixture<RapportTresorerie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportTresorerie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportTresorerie);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
