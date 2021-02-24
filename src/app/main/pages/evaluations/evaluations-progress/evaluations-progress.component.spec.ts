import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsProgressComponent } from './evaluations-progress.component';

describe('EvaluationsProgressComponent', () => {
  let component: EvaluationsProgressComponent;
  let fixture: ComponentFixture<EvaluationsProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
