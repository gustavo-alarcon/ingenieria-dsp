import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InitialEvaluation } from 'src/app/main/models/initialEvaluations.models';
import { InitialEvaluationsService } from 'src/app/main/services/initial-evaluations.service';

@Component({
  selector: 'app-init-eval-reports',
  templateUrl: './init-eval-reports.component.html',
  styleUrls: ['./init-eval-reports.component.scss']
})
export class InitEvalReportsComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  initEvalsDataSource = new MatTableDataSource<InitialEvaluation>();
  initEvalsDisplayedColumns: string[] = ['date', 'ot', 'status', 'actions'];

  @ViewChild('initEvalsPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.initEvalsDataSource.paginator = paginator;
  }

  @ViewChild(MatSort) sort: MatSort;

  buttonStyle: any;

  subscriptions = new Subscription();
  isMobile = false;

  initEvals$: Observable<Array<InitialEvaluation>>;

  constructor(
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

    this.initEvals$ =
      this.initEvalService.getInitialEvaluations()
        .pipe(
          tap(list => {
            this.initEvalsDataSource.data = list;
          })
        )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  generateDispatch(data: InitialEvaluation): void {
    this.initEvalService.actualReception = data;
  }

}
