import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateDialogImprovenmentsComponent } from './dialogs/create-dialog-improvenments/create-dialog-improvenments.component';
import { EditDialogImprovenmentsComponent } from './dialogs/edit-dialog-improvenments/edit-dialog-improvenments.component';
import { DeleteDialogImprovenmentsComponent } from './dialogs/delete-dialog-improvenments/delete-dialog-improvenments.component';
import { ValidateDialogImprovenmentsComponent } from './dialogs/validate-dialog-improvenments/validate-dialog-improvenments.component';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  tap,
} from 'rxjs/operators';
import { ImprovementsService } from '../../../services/improvements.service';
import { ImprovementEntry } from '../../../models/improvenents.model';
import { ShowDialogImprovementsComponent } from './dialogs/show-dialog-improvements/show-dialog-improvements.component';
import { MatSort, Sort } from '@angular/material/sort';
import { ReplacementDialogImprovementsComponent } from './dialogs/replacement-dialog-improvements/replacement-dialog-improvements.component';
import { FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-improvements',
  templateUrl: './improvements.component.html',
  styleUrls: ['./improvements.component.scss'],
})
export class ImprovementsComponent implements OnInit, OnDestroy {
  selected: any;

  improvement$: Observable<ImprovementEntry[]>;

  // Improvement
  improvementDataSource = new MatTableDataSource<ImprovementEntry>();
  improvementDisplayedColumns: string[] = [
    'date',
    'name',
    'component',
    'model',
    'criticalPart',
    'createdBy',
    'state',
    'actions',
  ];

  @ViewChild('improvementPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.improvementDataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set sortContent(sort: MatSort) {
    this.improvementDataSource.sort = sort;
  }

  sortedData: ImprovementEntry[];
  improvementEntries: ImprovementEntry[];

  searchControl = new FormControl('');
  stateControl = new FormControl('');

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private impvServices: ImprovementsService,
    public authService: AuthService,
    public dialog: MatDialog
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

    this.improvement$ = combineLatest(
      this.impvServices.getAllImprovementEntries(),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.stateControl.valueChanges.pipe(startWith(''))
    ).pipe(
      map(([list, search, state]) => {
        let filtered = [...list];

        const term = search.toLowerCase().trim();

        filtered = list.filter(
          (element) =>
            element.component.toLowerCase().includes(term) ||
            element.name.toLowerCase().includes(term) ||
            element.model.toLowerCase().includes(term)
        );

        filtered = filtered.filter((element) => {
          if (state === '') return true;
          return element.state === state;
        });

        return filtered;
      }),
      tap((res) => {
        if (res) {
          this.improvementEntries = res;
          this.improvementDataSource.data = res;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openDialog(value: string, entry?: ImprovementEntry, index?: number): void {
    const optionsDialog = {
      width: '100%',
      data: entry,
    };
    let dialogRef;

    switch (value) {
      case 'create':
        dialogRef = this.dialog.open(
          CreateDialogImprovenmentsComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'validate':
        dialogRef = this.dialog.open(
          ValidateDialogImprovenmentsComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'replacement':
        dialogRef = this.dialog.open(
          ReplacementDialogImprovementsComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        dialogRef = this.dialog.open(
          EditDialogImprovenmentsComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;

      case 'delete':
        dialogRef = this.dialog.open(DeleteDialogImprovenmentsComponent, {
          width: '350px',
          data: this.improvementDataSource.data[index],
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

  showImprovementEntry(row: ImprovementEntry): void {
    this.dialog.open(ShowDialogImprovementsComponent, {
      width: '100%',
      data: row,
    });
  }

  sortData(sort: Sort) {
    const data = this.improvementEntries.slice();
    if (!sort.active || sort.direction === '') {
      this.improvementDataSource.data = data;
      return;
    }

    this.improvementDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'createdBy':
          return compare(a.createdBy.name, b.createdBy.name, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
