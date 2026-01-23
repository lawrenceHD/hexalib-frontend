import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouvementForm } from './mouvement-form';

describe('MouvementForm', () => {
  let component: MouvementForm;
  let fixture: ComponentFixture<MouvementForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouvementForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MouvementForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
