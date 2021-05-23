import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Replacement } from '../../../models/replacements.models';
import { ReplacementsService } from '../../../services/replacements.service';
import { CreateDialogReplacementsComponent } from './dialogs/create-dialog-replacements/create-dialog-replacements.component';
import { DeleteDialogReplacementsComponent } from './dialogs/delete-dialog-replacements/delete-dialog-replacements.component';
import { EditDialogReplacementsComponent } from './dialogs/edit-dialog-replacements/edit-dialog-replacements.component';
import { UploadFileDialogReplacementsComponent } from './dialogs/upload-file-dialog-replacements/upload-file-dialog-replacements.component';


@Component({
  selector: 'app-replacements',
  templateUrl: './replacements.component.html',
  styleUrls: ['./replacements.component.scss']
})
export class ReplacementsComponent implements OnInit, OnDestroy {

  replacement$: Observable<Replacement[]>;

  // replacement
  replacementDataSource = new MatTableDataSource<Replacement>();
  replacementDisplayedColumns: string[] = ['createdAt', 'replacedPart', 'currentPart', 'description', 'kit', 'support', 'createdBy', 'actions'];

  @ViewChild('replacementPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.replacementDataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set sortContent(sort: MatSort) {
    this.replacementDataSource.sort = sort;
  }

  sortedData: Replacement[];
  replacements: Replacement[];

  searchControl = new FormControl('');

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private repServices: ReplacementsService,
    public authService: AuthService,
    private dialog: MatDialog
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

    this.replacement$ = combineLatest(
      this.repServices.getAllReplacements(),
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged())
    ).pipe(
      map(([list, search]) => {
        const term = search.toLowerCase().trim();
        let filteredList = list.filter(element => element.replacedPart?.toLowerCase().includes(term) ||
          element.currentPart?.toLowerCase().includes(term) ||
          element.description?.toLowerCase().includes(term));

        return filteredList
      }),
      tap(res => {
        if (res) {
          this.replacements = res;
          this.replacementDataSource.data = res;
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openDialog(value: string, entry?: Replacement, index?: number): void {
    const optionsDialog = {
      width: '100%',
      data: entry
    };
    let dialogRef;

    switch (value) {
      case 'create':
        dialogRef = this.dialog.open(CreateDialogReplacementsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'create-bulk':
        dialogRef = this.dialog.open(UploadFileDialogReplacementsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        dialogRef = this.dialog.open(EditDialogReplacementsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;

      case 'delete':
        dialogRef = this.dialog.open(DeleteDialogReplacementsComponent, {
          width: '350px',
          data: this.replacementDataSource.data[index]
        }
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

  sortData(sort: Sort) {
    const data = this.replacements.slice();
    if (!sort.active || sort.direction === '') {
      this.replacementDataSource.data = data;
      return;
    }

    this.replacementDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'createdBy': return compare(a.createdBy.name, b.createdBy.name, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
