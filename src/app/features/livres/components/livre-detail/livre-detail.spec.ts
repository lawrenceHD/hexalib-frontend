import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreDetail } from './livre-detail';

describe('LivreDetail', () => {
  let component: LivreDetail;
  let fixture: ComponentFixture<LivreDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
