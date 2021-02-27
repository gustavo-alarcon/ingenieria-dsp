import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsSettingsDialogComponent } from './evaluations-settings-dialog.component';

describe('EvaluationsSettingsDialogComponent', () => {
  let component: EvaluationsSettingsDialogComponent;
  let fixture: ComponentFixture<EvaluationsSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsSettingsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
