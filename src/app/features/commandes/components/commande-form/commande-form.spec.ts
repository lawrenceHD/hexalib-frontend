import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeForm } from './commande-form';

describe('CommandeForm', () => {
  let component: CommandeForm;
  let fixture: ComponentFixture<CommandeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
