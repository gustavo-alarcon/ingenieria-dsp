import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, take, tap } from 'rxjs/operators';
import { Improvement } from '../../../models/improvenents.model';
import { ImprovementsService } from '../../../services/improvements.service';
import * as XLSX from 'xlsx';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSparePartDialogComponent } from './dialogs/delete-spare-part-dialog/delete-spare-part-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  summaryDataSource = new MatTableDataSource<Improvement>();
  summaryDisplayedColumns: string[] = ['createdAt', 'component', 'model', 'media', 'description', 'criticalPart', 'name', 'quantity', 'improvedPart', 'currentPart', 'stock', 'availability', 'createdBy', 'actions'];

  @ViewChild('summaryPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.summaryDataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set sortContent(sort: MatSort) {
    this.summaryDataSource.sort = sort;
  }

  sortedData: Improvement[];
  improvements: Improvement[];

  summary$: Observable<Improvement[]>;

  searchControl = new FormControl('');
  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private impService: ImprovementsService,
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

    this.summary$ = combineLatest(
      this.impService.getAllImprovements(),
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged())
    ).pipe(
      map(([list, search]) => {
        const term = search.toLowerCase().trim();
        let filteredList = list.filter(element => element.component.toLowerCase().includes(term) ||
          element.model.toLowerCase().includes(term) ||
          element.improvedPart.toLowerCase().includes(term) ||
          element.currentPart.toLowerCase().includes(term) ||
          element.name.toLowerCase().includes(term));

        return filteredList
      }),
      tap(res => {
        if (res) {
          this.improvements = res;
          this.summaryDataSource.data = res;
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  remove(id: string): void {

    this.dialog.open(DeleteSparePartDialogComponent, {
      width: '500px',
      maxWidth: '80vw',
      data: id
    })



  }

  downloadXlsx(improvement: Improvement[]): void {
    const tableXlsx: any[] = [];
    const headersXlsx = [
      'date',
      'component',
      'model',
      'media',
      'description',
      'criticalPart',
      'name',
      'quantity',
      'improvedPart',
      'currentPart',
      'createdAt',
      'stock',
      'availability',
      // 'createdBy',
      // 'editedAt',
      // 'editedBy',
      // 'id',
      // 'kit',
      // 'rate',
    ];


    tableXlsx.push(headersXlsx);

    improvement.forEach(item => {
      const temp = [
        item.date ? new Date(item.date['seconds'] * 1000) : '---',
        item.component ? item.component : '---',
        item.model ? item.model : '---',
        item.media ? 'SI' : 'NO',
        item.description ? item.description : '---',
        item.criticalPart ? 'SI' : 'NO',
        item.name ? item.name : '---',
        item.quantity ? item.quantity : '---',
        item.improvedPart ? item.improvedPart : '---',
        item.currentPart ? item.currentPart : '---',
        item.createdAt ? new Date(item.createdAt['seconds'] * 1000) : '---',
        item.stock ? item.stock : '---',
        item.availability ? new Date(item.availability['seconds'] * 1000) : '---',
      ];
      tableXlsx.push(temp);
    });


    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableXlsx);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tabla_Resumen');
    /* save to file */
    const name = `Tabla_Resumen.xlsx`;
    XLSX.writeFile(wb, name);
  }

  sortData(sort: Sort) {
    const data = this.improvements.slice();
    if (!sort.active || sort.direction === '') {
      this.summaryDataSource.data = data;
      return;
    }

    this.summaryDataSource.data = data.sort((a, b) => {
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
