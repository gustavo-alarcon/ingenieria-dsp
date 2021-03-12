import { BaseOverlayDispatcher } from '@angular/cdk/overlay/dispatchers/base-overlay-dispatcher';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Improvement } from '../../../models/improvenents.model';
import { ImprovementsService } from '../../../services/improvements.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, AfterViewInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  summaryDataSource = new MatTableDataSource<Improvement>();
  summaryDisplayedColumns: string[] = ['date', 'component', 'model', 'media', 'description', 'criticalPart', 'name', 'quantity', 'improvedPart', 'currentPart', 'stock', 'availability', 'actions'];

  @ViewChild('summaryPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.summaryDataSource.paginator = paginator;
  }

  @ViewChild(MatSort) sort: MatSort;

  summary$: Observable<Improvement[]>;

  constructor(
    private impService: ImprovementsService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.summary$ =
      this.impService.getAllImprovements()
        .pipe(
          map(list => {
            if (list) {
              return this.summaryDataSource.data = list;
            } else {
              return this.summaryDataSource.data = [];
            }
          })
        );
  }

  ngAfterViewInit(): void {
    this.summaryDataSource.sort = this.sort;
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

}
