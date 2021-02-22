import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInsertImprovementsComponent } from './dialog-insert-improvements.component';

describe('DialogInsertImprovementsComponent', () => {
  let component: DialogInsertImprovementsComponent;
  let fixture: ComponentFixture<DialogInsertImprovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInsertImprovementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInsertImprovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
