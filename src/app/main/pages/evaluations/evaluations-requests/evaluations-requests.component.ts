import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsObservationDialogComponent } from './dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from './dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from './dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from './dialogs/requests-time-line-dialog/requests-time-line-dialog.component';
import { Evaluation } from '../../../models/evaluations.model';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import {
  tap,
  map,
  startWith,
  filter,
  share,
  debounce,
  debounceTime,
  switchMap,
} from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../auth/services/auth.service';
import { EvaluationsService } from '../../../services/evaluations.service';

@Component({
  selector: 'app-evaluations-requests',
  templateUrl: './evaluations-requests.component.html',
  styleUrls: ['./evaluations-requests.component.scss'],
})
export class EvaluationsRequestsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  evaluation$: Observable<Evaluation[]>;
  dataEvaluations: Evaluation[] = [];
  counter: number;
  searchForm: FormGroup;
  state = 'registered';

  tallerObservable$: Observable<[any, Evaluation[]]>;

  workshopControl: FormControl;
  tallerList$: Observable<Evaluation[]>;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private evaltService: EvaluationsService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      ot: null,
    });
    this.workshopControl = this.fb.control('', Validators.required);

    this.evaluation$ = combineLatest(
      this.evaltService.getAllEvaluationsByInternalStatus(this.state),
      this.workshopControl.valueChanges.pipe(startWith('')),
      this.searchForm.get('ot').valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.internalStatus.toLowerCase()),
        tap(rs => {
          this.loading.next(true);
        }))
    ).pipe(
      map(([evaluations, workshop, name]) => {

        const searchTerm = name.toLowerCase();
        let preFilterSearch = [...evaluations];

        if (workshop.code) {
          const preFilterWorkshop = evaluations.filter(evaluation => evaluation.workshop === workshop.code);

          preFilterSearch = preFilterWorkshop.filter(evaluation => {
            return evaluation.otMain.toLowerCase().includes(searchTerm) ||
            evaluation.otChild.toLowerCase().includes(searchTerm);
          });
        } else {
          preFilterSearch = evaluations.filter(evaluation => {
            return evaluation.otMain.toLowerCase().includes(searchTerm) ||
            evaluation.otChild.toLowerCase().includes(searchTerm);
          });
        }

        return preFilterSearch;
      }),
      tap(res => {
        this.dataEvaluations = res;
        this.counter = this.dataEvaluations.length;
        this.loading.next(false);
        return this.dataEvaluations;
      })
    );

    this.tallerList$ = this.evaltService.getAllEvaluationsByInternalStatus(
      this.state
    );
    /* this.evaluation$ = this.evaltService.getAllEvaluationsByInternalStatus(this.state).pipe(
      tap(res => {
        console.log('res : ', res)
        if (res) {
          this.dataEvaluations = res;
          this.counter = this.dataEvaluations.length;
          this.loading.next(false);
        }
      })
    ); */

  }

  settingDialog(): void {
    this.dialog.open(RequestsSettingDialogComponent, {
      width: '35%',
    });
  }

  initDialog(item: Evaluation): void {
    this.dialog.open(RequestsStartDialogComponent, {
      width: '30%',
      data: item,
    });
  }
  obsDialog(item): void {
    this.dialog.open(RequestsObservationDialogComponent, {
      width: '35%',
      data: item,
    });
  }
  timeline(item): void {
    this.dialog.open(RequestsTimeLineDialogComponent, {
      width: '90%',
      data: item,
    });
  }
}
