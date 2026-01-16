import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductionDetail } from './reduction-detail';

describe('ReductionDetail', () => {
  let component: ReductionDetail;
  let fixture: ComponentFixture<ReductionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReductionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
