import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsObservationsDialogComponent } from './evaluations-observations-dialog.component';

describe('EvaluationsObservationsDialogComponent', () => {
  let component: EvaluationsObservationsDialogComponent;
  let fixture: ComponentFixture<EvaluationsObservationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsObservationsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsObservationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
