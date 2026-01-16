import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductionList } from './reduction-list';

describe('ReductionList', () => {
  let component: ReductionList;
  let fixture: ComponentFixture<ReductionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReductionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
