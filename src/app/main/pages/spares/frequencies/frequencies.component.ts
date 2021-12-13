import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrequencySparePart } from 'src/app/main/models/frequencySparePart.model';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';
import { BulkDialogComponent } from './dialogs/bulk-dialog/bulk-dialog.component';
import { CreateFrequencyDialogComponent } from './dialogs/create-frequency-dialog/create-frequency-dialog.component';
import { DeleteFrequencyDialogComponent } from './dialogs/delete-frequency-dialog/delete-frequency-dialog.component';
import { EditFrequencyDialogComponent } from './dialogs/edit-frequency-dialog/edit-frequency-dialog.component';

@Component({
  selector: 'app-frequencies',
  templateUrl: './frequencies.component.html',
  styleUrls: ['./frequencies.component.scss'],
})
export class FrequenciesComponent implements OnInit, OnDestroy {
  frequencies$: Observable<FrequencySparePart[]>;

  // frequency
  frequenciesDataSource = new MatTableDataSource<FrequencySparePart>();
  frequenciesDisplayedColumns: string[] = [
    'createdAt',
    'partNumber',
    'frequency',
    'avgQty',
    'minQty',
    'maxQty',
    'createdBy',
    'editedBy',
    'actions',
  ];

  @ViewChild('frequenciesPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.frequenciesDataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set sortContent(sort: MatSort) {
    this.frequenciesDataSource.sort = sort;
  }

  sortedData: FrequencySparePart[];
  frequencies: FrequencySparePart[];

  searchControl = new FormControl('');

  subscriptions = new Subscription();
  isMobile = false;
  constructor(
    private breakpoint: BreakpointObserver,
    private freqService: FrequenciesService,
    public authService: AuthService,
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

    this.frequencies$ = combineLatest(
      this.freqService.getAllFrequencies(),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
    ).pipe(
      map(([list, search]) => {
        const term = search.toLowerCase().trim();
        let filteredList = list.filter((element) =>
          element.partNumber?.toLowerCase().includes(term)
        );

        return filteredList;
      }),
      tap((res) => {
        if (res) {
          this.frequencies = res;
          this.frequenciesDataSource.data = res;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openDialog(value: string, entry?: FrequencySparePart, index?: number): void {
    const optionsDialog = {
      width: '100%',
      data: entry,
    };

    let dialogRef;

    switch (value) {
      case 'create':
        dialogRef = this.dialog.open(
          CreateFrequencyDialogComponent
          // optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'create-bulk':
        dialogRef = this.dialog.open(BulkDialogComponent, optionsDialog);

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        dialogRef = this.dialog.open(EditFrequencyDialogComponent, {
          data: entry,
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;

      case 'delete':
        dialogRef = this.dialog.open(DeleteFrequencyDialogComponent, {
          width: '350px',
          data: entry,
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

  sortData(sort: Sort) {
    const data = this.frequencies.slice();
    if (!sort.active || sort.direction === '') {
      this.frequenciesDataSource.data = data;
      return;
    }

    this.frequenciesDataSource.data = data.sort((a, b) => {
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
