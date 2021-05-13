import { MyErrorStateMatcher } from './../../evaluations/evaluations-settings/evaluations-settings.component';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-budgets-configurations',
  templateUrl: './budgets-configurations.component.html',
  styleUrls: ['./budgets-configurations.component.scss'],
})
export class BudgetsConfigurationsComponent implements OnInit {
  // Loaders
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean> = this.loading.asObservable();

  // Form controllers
  public listReasonsForRejectionFormControl: FormControl = new FormControl(
    null,
    Validators.required
  );
  public listReasonsForModificationFormControl: FormControl = new FormControl(
    null,
    Validators.required
  );

  // Matchers
  public matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  // Data
  public listReasonsForRejectionArray: Array<any> = [];
  public listReasonsForModificationArray: Array<any> = [];

  constructor() {}

  ngOnInit(): void {}

  public saveReasonsForRejection(): void {}

  public saveReasonsForModifiacation(): void {}

  public addDeleteListResult(s: string, i?: number): void {}
}
