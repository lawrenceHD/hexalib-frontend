import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductionForm } from './reduction-form';

describe('ReductionForm', () => {
  let component: ReductionForm;
  let fixture: ComponentFixture<ReductionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReductionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
