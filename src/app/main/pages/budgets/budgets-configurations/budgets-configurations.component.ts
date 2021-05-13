import { MyErrorStateMatcher } from './../../evaluations/evaluations-settings/evaluations-settings.component';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BudgetsService } from 'src/app/main/services/budgets.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private budgetService: BudgetsService,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  public saveReasonsForRejection(): void {
    // valdiations
    this.loading.next(true);

    this.authService.user$
      .pipe(
        take(1)
      ).subscribe(user => {
        this.budgetService.saveRejectionReasonsEntry('nombre', user)
          .pipe(
            take(1)
          )
          .subscribe(batch => {
            if (batch) {
              batch.commit()
                .then(() => {
                  this.loading.next(false);
                  this.snackbar.open('✅ Operación exitosa!', 'Aceptar', {
                    duration: 6000
                  });
                })
                .catch(err => {
                  console.log(err);
                  this.snackbar.open('🚨 Hubo un error guardando el documento', 'Aceptar', {
                    duration: 6000
                  });
                })
            }
          })
      })
  }

  public saveReasonsForModifiacation(): void { }

  public addDeleteListResult(s: string, i?: number): void { }
}
