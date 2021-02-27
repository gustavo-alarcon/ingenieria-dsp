import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsResponseDialogComponent } from './evaluations-response-dialog.component';

describe('EvaluationsResponseDialogComponent', () => {
  let component: EvaluationsResponseDialogComponent;
  let fixture: ComponentFixture<EvaluationsResponseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsResponseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
