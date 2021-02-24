import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsFinalizeDialogComponent } from './evaluations-finalize-dialog.component';

describe('EvaluationsFinalizeDialogComponent', () => {
  let component: EvaluationsFinalizeDialogComponent;
  let fixture: ComponentFixture<EvaluationsFinalizeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsFinalizeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsFinalizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
