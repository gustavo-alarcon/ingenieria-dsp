import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, take, tap } from 'rxjs/operators';
import { InitialEvaluation } from 'src/app/main/models/initialEvaluations.models';
import { InitialEvaluationsService } from 'src/app/main/services/initial-evaluations.service';
import { PrintReceptionDispatchComponent } from './print-reception-dispatch/print-reception-dispatch.component';

@Component({
  selector: 'app-init-eval-reports',
  templateUrl: './init-eval-reports.component.html',
  styleUrls: ['./init-eval-reports.component.scss']
})
export class InitEvalReportsComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  initEvalsDataSource = new MatTableDataSource<InitialEvaluation>();
  initEvalsDisplayedColumns: string[] = ['date', 'ot', 'status', 'createdBy', 'actions'];

  @ViewChild('initEvalsPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.initEvalsDataSource.paginator = paginator;
  }

  @ViewChild(MatSort) sort: MatSort;

  buttonStyle: any;

  subscriptions = new Subscription();
  isMobile = false;

  initEvals$: Observable<Array<InitialEvaluation>>;

  searchControl = new FormControl('');

  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private initEvalService: InitialEvaluationsService,
    private breakpoint: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      })
    )

    this.initEvals$ = combineLatest(
      this.initEvalService.getInitialEvaluations(),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(100),
        distinctUntilChanged(),
        map(value => value ? value.toLowerCase().trim() : '')
      )
    ).pipe(
      map(([list, term]) => {
        const filter = list.filter(item => item.ot.includes(term));
        this.initEvalsDataSource.data = filter;
        return filter;
      })
    )

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  generateDispatch(data: InitialEvaluation): void {
    this.initEvalService.actualReception = data;
  }

  openDialog(type: string, data: InitialEvaluation): void {
    this.dialog.open(PrintReceptionDispatchComponent, {
      width: '90vw',
      maxWidth: '600px',
      disableClose: true,
      data: {
        type: type,
        data: data
      }
    })
  }

  delete(data: InitialEvaluation): void {
    this.loading.next(true);

    this.initEvalService.deleteReceptionDispatch(data)
      .pipe(
        take(1)
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.snackbar.open('🗑️ Reporte borrado correctamente', 'Aceptar', {
                duration: 6000
              });
              this.loading.next(false);
            })
            .catch(err => {
              console.log(err);
              this.snackbar.open('🚨 Parece que hubo un error borrando el reporte. Intentelo de nuevo', 'Aceptar', {
                duration: 6000
              });
            })
        }
      })
  }

}
