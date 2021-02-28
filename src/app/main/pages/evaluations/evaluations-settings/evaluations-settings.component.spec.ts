import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsSettingsComponent } from './evaluations-settings.component';

describe('EvaluationsSettingsComponent', () => {
  let component: EvaluationsSettingsComponent;
  let fixture: ComponentFixture<EvaluationsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
