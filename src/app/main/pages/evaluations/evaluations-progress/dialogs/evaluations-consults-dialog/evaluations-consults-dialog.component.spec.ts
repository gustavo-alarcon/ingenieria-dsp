import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsConsultsDialogComponent } from './evaluations-consults-dialog.component';

describe('EvaluationsConsultsDialogComponent', () => {
  let component: EvaluationsConsultsDialogComponent;
  let fixture: ComponentFixture<EvaluationsConsultsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsConsultsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsConsultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
