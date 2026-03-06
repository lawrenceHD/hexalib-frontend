import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportJournalier } from './rapport-journalier';

describe('RapportJournalier', () => {
  let component: RapportJournalier;
  let fixture: ComponentFixture<RapportJournalier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportJournalier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportJournalier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
