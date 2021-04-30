import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsImagesDialogComponent } from './evaluations-images-dialog.component';

describe('EvaluationsImagesDialogComponent', () => {
  let component: EvaluationsImagesDialogComponent;
  let fixture: ComponentFixture<EvaluationsImagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsImagesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsImagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
