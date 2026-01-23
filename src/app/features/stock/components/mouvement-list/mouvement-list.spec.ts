import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementList } from './mouvement-list';

describe('MouvementList', () => {
  let component: MouvementList;
  let fixture: ComponentFixture<MouvementList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouvementList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MouvementList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
