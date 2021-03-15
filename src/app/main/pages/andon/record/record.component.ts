import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, combineLatest } from 'rxjs';
import { Andon } from '../../../models/andon.model';
import { AndonService } from '../../../services/andon.service';
import { tap, debounceTime, filter, startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from './dialog/image-dialog/image-dialog.component';
import * as XLSX from 'xlsx';
import { EvaluationsService } from '../../../services/evaluations.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  searchForm: FormGroup;
  records$: Observable<Andon[]>;
  dateForm: FormGroup;
  
  historyDataSource = new MatTableDataSource<Andon>();
  historyDisplayedColumns: string[] = [
    'reportDate',
    'workShop',
    'name',
    'otChild',
    'problemType',
    'description',
    'atentionTime',
    'reportUser',
    'state',
    'workReturnDate',
    'comments',
    'returnUser',
    'actions',
  ];

  @ViewChild('historyPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.historyDataSource.paginator = paginator;
  }
  historyMobilDataSource = new MatTableDataSource<Andon>();
  historyMobilDisplayedColumns: string[] = [
    'state',
    'reportDate',
    'name',
    'workShop',
    'otChild',
    'problemType',
    'description',
    'atentionTime',
    'actions',
  ];

  @ViewChild('historyMobilPaginator', { static: false }) set content1(
    paginator: MatPaginator
  ) {
    this.historyMobilDataSource.paginator = paginator;
  }
  constructor(
     private dbs: EvaluationsService,
     private fb: FormBuilder,
     private andonService: AndonService,
     public dialog: MatDialog,
     ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['', Validators.required],
    });
    const view = this.dbs.getCurrentMonthOfViewDate();

    const beginDate = view.from;
    const endDate = new Date();
    endDate.setHours(23, 59, 59);

    this.dateForm = new FormGroup({
      start: new FormControl(beginDate),
      end: new FormControl(endDate),
    });

    this.records$ = combineLatest(
      this.andonService.getAllAndon(),
      this.searchForm.get('search').valueChanges.pipe(
        debounceTime(300),
        filter((input) => input !== null),
        startWith<any>('')
      ),
      this.dateForm.get('start').valueChanges.pipe(
        startWith(beginDate),
        map(begin => begin.setHours(0, 0, 0, 0))
      ),
      this.dateForm.get('end').valueChanges.pipe(
        startWith(endDate),
        map(end =>  end ? end.setHours(23, 59, 59) : null)
      )
    ).pipe(
      map(([andons, search, startdate, enddate]) => {

        const date = {begin: startdate, end: enddate};

        const searchTerm = search.toLowerCase().trim();
        let preFilterSearch: Andon[] = [...andons];

        if (search) {
          let filterDate = [];
          filterDate = preFilterSearch.filter((andon) => {
            return this.getFilterTime(andon.reportDate, date);
          });

          preFilterSearch = filterDate.filter((andon) => {
            return (
              String(andon.name ).toLowerCase().includes(searchTerm) ||
              String(andon.otChild).toLowerCase().includes(searchTerm)
            );
          });
        } else{
          preFilterSearch = andons.filter((andon) => {
            return this.getFilterTime(andon.reportDate, date);
          });
        }
        return preFilterSearch;

      }),
      tap(res => {
        this.historyDataSource.data = res;
        this.historyMobilDataSource.data = res;
      })
    );
  }

  getFilterTime(el, time): any {
    const date = el.toMillis();
    const begin = time.begin;
    const end = time.end;
    return date >= begin && date <= end;
  }

  imageDialog(item): void {
    this.dialog.open(ImageDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item,
    });
  }

  downloadXls(): void {
    let table_xlsx: any[] = [];
    const headersXlsx = [
      'Fecha de reporte', 'Taller', 'Nombre de bahia', 'OT CHILD', 'Tipo de problema', 'Descripcion', 'Tiempo de atencion', 'Usuario de reporte',
       'Estado', 'Fecha de retorno trabajo', 'Comentarios', 'Usuario de retorno' ]

    table_xlsx.push(headersXlsx);

    this.historyDataSource.filteredData.forEach(item => {
      const temp = [
        item.reportDate,
        item.workShop,
        item.name,
        item.otChild,
        item.problemType,
        item.description,
        item.atentionTime,
        item.reportUser,
        item.state,
        item.workReturnDate,
        item.comments,
        item.returnUser,
      ];

      table_xlsx.push(temp);
    })

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(table_xlsx);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'reports');

    /* save to file */
    const name = 'report_list' + '.xlsx';
    XLSX.writeFile(wb, name);
  }
}
