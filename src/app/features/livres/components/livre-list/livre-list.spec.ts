import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreList } from './livre-list';

describe('LivreList', () => {
  let component: LivreList;
  let fixture: ComponentFixture<LivreList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
