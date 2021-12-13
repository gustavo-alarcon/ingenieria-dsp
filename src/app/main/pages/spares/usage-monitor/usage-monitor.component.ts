import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ReviewHistory } from 'src/app/main/models/frequencySparePart.model';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';

@Component({
  selector: 'app-usage-monitor',
  templateUrl: './usage-monitor.component.html',
  styleUrls: ['./usage-monitor.component.scss'],
})
export class UsageMonitorComponent implements OnInit, OnDestroy {
  histories$: Observable<ReviewHistory[]>;

  // frequency
  historiesDataSource = new MatTableDataSource<ReviewHistory>();
  historiesDisplayedColumns: string[] = [
    'createdAt',
    'ot',
    'createdBy',
    'spareParts',
  ];

  @ViewChild('historiesPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.historiesDataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set sortContent(sort: MatSort) {
    this.historiesDataSource.sort = sort;
  }

  sortedData: ReviewHistory[];
  histories: ReviewHistory[];

  technicianControl = new FormControl('');
  otControl = new FormControl('');
  dateControl: FormGroup;

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private freqService: FrequenciesService,
    public authService: AuthService,
    private evalService: EvaluationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.isMobile = true;
          } else {
            this.isMobile = false;
          }
        })
    );

    const view = this.evalService.getCurrentMonthOfViewDate();

    const beginDate = view.from;
    const endDate = new Date();
    endDate.setHours(23, 59, 59);

    this.dateControl = new FormGroup({
      start: new FormControl(beginDate),
      end: new FormControl(endDate),
    });

    this.histories$ = combineLatest(
      this.dateControl.valueChanges.pipe(
        startWith({ start: beginDate, end: endDate }),
        switchMap((date) => {
          if (!date.start || !date.end) return of([]);

          date.end.setHours(23, 59, 59);
          return this.freqService.getHistory(date.start, date.end);
        })
      ),
      this.technicianControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.otControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
    ).pipe(
      map(([list, technician, ot]) => {
        const technicianTerm = technician.toLowerCase().trim();
        const otTerm = ot.toLowerCase().trim();

        console.log(technicianTerm);
        console.log(otTerm);

        let filteredList = list.filter((element) => {
          if (technicianTerm === '') return true;
          return element.createdBy.displayName
            .toLowerCase()
            .includes(technicianTerm);
        });

        filteredList = filteredList.filter((element) => {
          if (otTerm === '') return true;
          return element.ot.toLowerCase().includes(otTerm);
        });

        return filteredList;
      }),
      tap((res) => {
        if (res) {
          this.histories = res;
          this.historiesDataSource.data = res;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  sortData(sort: Sort) {
    const data = this.histories.slice();
    if (!sort.active || sort.direction === '') {
      this.historiesDataSource.data = data;
      return;
    }

    this.historiesDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'createdBy':
          return compare(
            a.createdBy.displayName,
            b.createdBy.displayName,
            isAsc
          );
        case 'editedBy':
          return compare(
            a.createdBy.displayName,
            b.createdBy.displayName,
            isAsc
          );
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
