import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDashboard } from './rapport-dashboard';

describe('RapportDashboard', () => {
  let component: RapportDashboard;
  let fixture: ComponentFixture<RapportDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
