import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartsComponent } from './spare-parts.component';

describe('SparePartsComponent', () => {
  let component: SparePartsComponent;
  let fixture: ComponentFixture<SparePartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparePartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
