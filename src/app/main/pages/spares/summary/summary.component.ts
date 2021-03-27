import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Improvement } from '../../../models/improvenents.model';
import { ImprovementsService } from '../../../services/improvements.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
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

  constructor(
    private impService: ImprovementsService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.summary$ =
      this.impService.getAllImprovements()
        .pipe(
          tap(list => {
            if (list) {
              this.improvements = list;
              this.summaryDataSource.data = list;
            } else {
              this.improvements = [];
              this.summaryDataSource.data = [];
            }
          })
        );
  }

  remove(id: string): void {
    this.loading.next(true);

    this.impService.removeImprovement(id)
      .pipe(
        take(1)
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('🗑️ Elemento removido!', 'Aceptar', {
                duration: 6000
              });
            })
            .catch(err => {
              console.log(err);
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error guardando las mejoras!', 'Aceptar', {
                duration: 6000
              });
            });
        }
      });

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
