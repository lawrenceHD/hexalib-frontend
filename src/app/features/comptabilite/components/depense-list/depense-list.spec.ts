import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepenseList } from './depense-list';

describe('DepenseList', () => {
  let component: DepenseList;
  let fixture: ComponentFixture<DepenseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepenseList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepenseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
