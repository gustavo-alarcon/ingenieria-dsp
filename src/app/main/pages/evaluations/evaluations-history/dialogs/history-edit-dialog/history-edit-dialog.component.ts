import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { Subscription, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Evaluation, EvaluationsKindOfTest, EvaluationsResultTypeUser } from '../../../../../models/evaluations.model';
import { take, switchMap, map, tap, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-history-edit-dialog',
  templateUrl: './history-edit-dialog.component.html',
  styleUrls: ['./history-edit-dialog.component.scss']
})
export class HistoryEditDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  createEvaluateForm: FormGroup;

  filteredOptions: Observable<string[]>;

  obsAutoComplete$: Observable<EvaluationsResultTypeUser[]>;
  kindOfTests$: Observable<EvaluationsKindOfTest[]>;

  subscriptions: Subscription = new Subscription();

  indexAux: number[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<HistoryEditDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private evaltService: EvaluationsService,
  ) {
    console.log(data)
    this.obsAutoComplete$ = this.evaltService.getAllEvaluationsSettingsResultType();
  }

  ngOnInit(): void {
    this.createForm();
    this.filteredOptions = this.createEvaluateForm.controls.result.valueChanges
      .pipe(
        tap(() => {
          this.loading.next(true);
        }),
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          this.loading.next(false);
          return this.filter(val || '');
        }),
        tap(() => {
          this.loading.next(false);
        }),
      );

    this.kindOfTests$ = combineLatest(
      this.evaltService.getAllEvaluationsSettingsKindOfTest(),
      this.createEvaluateForm.controls.kindOfTest.valueChanges
        .pipe(
          startWith(''),
          debounceTime(200),
          distinctUntilChanged(),
          map(val => val.kindOfTest ? val.kindOfTest : val)
        )
    ).pipe(
      map(([list, term]) => {
        let search = term.trim().toLowerCase();
        return list.filter(element => element.kindOfTest.includes(search));
      })
    )
  }
  
  createForm(): void {
    this.createEvaluateForm = this.fb.group({
      otMain: [this.data.otMain ? this.data.otMain : null, Validators.required],
      otChild: [this.data.otChild ? this.data.otChild : null, Validators.required],
      position: [this.data.position ? this.data.position : null, Validators.required],
      partNumber: [this.data.partNumber ? this.data.partNumber : null, Validators.required],
      description: [this.data.description ? this.data.description : null, Validators.required],
      quantity: [this.data.quantity ? this.data.quantity : null, Validators.required],
      status: [this.data.status ? this.data.status : null, Validators.required],
      wof: [this.data.wof ? this.data.wof : null, Validators.required],
      task: [this.data.task ? this.data.task : null, Validators.required],
      result: [this.data.result ? this.data.result : null, Validators.required],
      kindOfTest: [this.data.kindOfTest ? this.data.kindOfTest : null, Validators.required],
      comments: [this.data.comments ? this.data.comments : null],
    });
  }

  save(): void {
    this.loading.next(true);
    if (this.createEvaluateForm.invalid) {
      this.createEvaluateForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      this.auth.user$.pipe(
        take(1),
        switchMap(user => {
          return this.evaltService.editRequest(this.data.id, this.createEvaluateForm.value, user);
        })
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('✅ se modifico correctamente!', 'Aceptar', {
                duration: 6000
              });
              this.dialogRef.close();
            })
            .catch(err => {
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error.', 'Aceptar', {
                duration: 6000
              });
            });
        }
      });
    }
  }

  filter(val: string): Observable<any> {
    return this.obsAutoComplete$
      .pipe(
        map(response => response.filter(option => {
          return option.resultType.toLowerCase().indexOf(val.toLowerCase()) === 0;
        }))
      );
  }

}
