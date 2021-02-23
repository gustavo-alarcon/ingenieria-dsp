import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEvaluationsComponent } from './search-evaluations.component';

describe('SearchEvaluationsComponent', () => {
  let component: SearchEvaluationsComponent;
  let fixture: ComponentFixture<SearchEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchEvaluationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
