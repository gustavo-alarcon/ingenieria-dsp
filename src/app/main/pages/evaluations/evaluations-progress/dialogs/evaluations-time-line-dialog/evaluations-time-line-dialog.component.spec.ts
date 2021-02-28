import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsTimeLineDialogComponent } from './evaluations-time-line-dialog.component';

describe('EvaluationsTimeLineDialogComponent', () => {
  let component: EvaluationsTimeLineDialogComponent;
  let fixture: ComponentFixture<EvaluationsTimeLineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsTimeLineDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsTimeLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
