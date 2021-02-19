import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogValidationLogisticsComponent } from './dialog-validation-logistics.component';

describe('DialogValidationLogisticsComponent', () => {
  let component: DialogValidationLogisticsComponent;
  let fixture: ComponentFixture<DialogValidationLogisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogValidationLogisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogValidationLogisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
