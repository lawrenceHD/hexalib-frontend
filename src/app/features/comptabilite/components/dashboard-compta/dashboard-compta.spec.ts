import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCompta } from './dashboard-compta';

describe('DashboardCompta', () => {
  let component: DashboardCompta;
  let fixture: ComponentFixture<DashboardCompta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCompta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCompta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
