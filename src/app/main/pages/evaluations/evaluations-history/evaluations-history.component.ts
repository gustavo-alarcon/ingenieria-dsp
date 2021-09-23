import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ImprovementEntry } from '../../../models/improvenents.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Evaluation, Workshop } from '../../../models/evaluations.model';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { EvaluationsService } from '../../../services/evaluations.service';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { HistoryEditDialogComponent } from './dialogs/history-edit-dialog/history-edit-dialog.component';
import { HistoryDeleteDialogComponent } from './dialogs/history-delete-dialog/history-delete-dialog.component';
import { HistoryImageDialogComponent } from './dialogs/history-image-dialog/history-image-dialog.component';
import { HistoryObservationDialogComponent } from './dialogs/history-observation-dialog/history-observation-dialog.component';
import { HistoryUploadFileDialogComponent } from './dialogs/history-upload-file-dialog/history-upload-file-dialog.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { HistoryCreateDialogComponent } from './dialogs/history-create-dialog/history-create-dialog.component';
import { HistoryTimeLineComponent } from './dialogs/history-time-line/history-time-line.component';
import jsPDF from 'jspdf';
import { HistoryReportsDialogComponent } from './dialogs/history-reports-dialog/history-reports-dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-evaluations-history',
  templateUrl: './evaluations-history.component.html',
  styleUrls: ['./evaluations-history.component.scss'],
  providers: [DatePipe]
})
export class EvaluationsHistoryComponent implements OnInit, OnDestroy {

  evaluation$: Observable<Evaluation[]>;

  historyDataSource = new MatTableDataSource<Evaluation>();
  historyEntries: Evaluation[] = [];

  improvementDisplayedColumns: string[] = [
    'otMain',
    'otChild',
    'wof',
    'task',
    // 'position',
    'partNumber',
    'description',
    'internalStatus',
    'result',
    'observations',
    'quantity',
    'workshop',
    // 'status',
    'createdAt',
    'processAt',
    'finalizedAt',
    'createdBy',
    'actions',
    // 'date'
  ];

  @ViewChild('improvementPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.historyDataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set sortContent(sort: MatSort) {
    this.historyDataSource.sort = sort;
  }

  dateForm: FormGroup;

  statusControl = new FormControl('');
  searchControl = new FormControl('');

  statusList = [
    { status: 'registered', name: 'Registrado' },
    { status: 'processed', name: 'En proceso' },
    { status: 'finalized', name: 'Finalizado' },
    { status: 'consultation', name: 'Consulta' },
  ]

  subscriptions = new Subscription();
  isMobile = false;

  constructor(
    private breakpoint: BreakpointObserver,
    public dialog: MatDialog,
    private evaltService: EvaluationsService,
    public authService: AuthService,
    private miDatePipe: DatePipe
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

    const view = this.evaltService.getCurrentMonthOfViewDate();

    const beginDate = view.from;
    const endDate = new Date();
    endDate.setHours(23, 59, 59);

    this.dateForm = new FormGroup({
      start: new FormControl(beginDate),
      end: new FormControl(endDate),
    });


    this.evaluation$ = combineLatest(
      this.evaltService.getAllEvaluations(),
      this.statusControl.valueChanges.pipe(startWith('')),
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),

      ),
      this.dateForm.get('start').valueChanges.pipe(
        startWith(beginDate),
        map(begin => begin.setHours(0, 0, 0, 0))
      ),
      this.dateForm.get('end').valueChanges.pipe(
        startWith(endDate),
        map(end => end ? end.setHours(23, 59, 59) : null)
      )
    ).pipe(
      map(([evaluations, status, search, startdate, enddate]) => {

        const date = { begin: startdate, end: enddate };
        const searchTerm = search.toLowerCase();

        let preFilterStatus = [];
        let preFilterSearch = [...evaluations];
        let preFilterWithDate = [];

        preFilterSearch.filter(element => {
          const dateMillis = element.createdAt['seconds'] * 1000;
          if (dateMillis >= date.begin && dateMillis <= date.end) {
            preFilterWithDate.push(element);
          }
        });

        if (status.length > 1) {
          preFilterStatus = preFilterWithDate.filter(evaluation => evaluation.internalStatus === status);
          preFilterSearch = preFilterStatus.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
              String(evaluation.otChild).toLowerCase().includes(searchTerm) ||
              String(evaluation.wof).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm) ||
              String(evaluation.description).toLowerCase().includes(searchTerm);
          }).filter((evaluation) => {
            return this.getFilterTime(evaluation.createdAt, date)
          })
        } else {
          preFilterSearch = preFilterWithDate.filter(evaluation => {
            return String(evaluation.otMain).toLowerCase().includes(searchTerm) ||
              String(evaluation.otChild).toLowerCase().includes(searchTerm) ||
              String(evaluation.wof).toLowerCase().includes(searchTerm) ||
              String(evaluation.partNumber).toLowerCase().includes(searchTerm) ||
              String(evaluation.description).toLowerCase().includes(searchTerm);
          }).filter((evaluation) => {
            return this.getFilterTime(evaluation.createdAt, date)
          })
        }
        return preFilterSearch;
      })
    ).pipe(
      tap(res => {
        if (res) {
          this.historyEntries = res;
          this.historyDataSource.data = res;
        }
      })
    )

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getFilterTime(el, time): any {
    const date = el.toMillis();
    const begin = time.begin;
    const end = time.end;
    return date >= begin && date <= end;
  }

  openDialog(value: string, entry?: ImprovementEntry, index?: number): void {
    const optionsDialog = {
      maxWidth: 500,
      width: '90vw',
      disableClose: true,
      data: entry
    };

    let dialogRef;

    switch (value) {
      case 'create':
        dialogRef = this.dialog.open(HistoryCreateDialogComponent,
          optionsDialog,
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        dialogRef = this.dialog.open(HistoryEditDialogComponent,
          optionsDialog,
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'delete':
        dialogRef = this.dialog.open(HistoryDeleteDialogComponent, {
          data: entry
        }
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'image':
        dialogRef = this.dialog.open(HistoryImageDialogComponent,
          optionsDialog
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'observation':
        dialogRef = this.dialog.open(HistoryObservationDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'time-line':
        dialogRef = this.dialog.open(HistoryTimeLineComponent,
          {
            width: '90vw',
            disableClose: true,
            data: entry
          }
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'report':
        let data = this.historyDataSource.data.filter(element => element.result === 'fuera de servicio');
        dialogRef = this.dialog.open(HistoryReportsDialogComponent,
          {
            maxWidth: 500,
            width: '90vw',
            disableClose: true,
            data: data
          }
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

  uploadFileDialog(): void {
    this.dialog.open(HistoryUploadFileDialogComponent, {
      width: '100%',
    });
  }



  downloadXlsx(evaluations: Evaluation[]): void {
    let table_xlsx: any[] = [];

    let headersXlsx = [
      'otMain',
      'otChild',
      // 'position',
      'wof',
      'task',
      'partNumber',
      'description',
      'internalStatus',
      'result',
      // 'comments',
      // 'kindOfTest',
      'observations',
      'quantity',
      'workshop',
      // 'status',
      'createdAt',
      'processAt',
      'finalizedAt',
      'finalizedBy',
      // 'inquiryAt'
    ]

    table_xlsx.push(headersXlsx);

    evaluations.forEach(evaluation => {
      const temp = [
        evaluation.otMain ? evaluation.otMain : '---',
        evaluation.otChild ? evaluation.otChild : '---',
        evaluation.wof ? evaluation.wof : '---',
        evaluation.task ? evaluation.task : '---',
        // evaluation.position ? evaluation.position : '---',
        evaluation.partNumber ? evaluation.partNumber : '---',
        evaluation.description ? evaluation.description : '---',
        evaluation.internalStatus ? evaluation.internalStatus : '---',
        evaluation.result ? evaluation.result : '---',
        // evaluation.comments ? evaluation.comments : '---',
        // evaluation.kindOfTest ? evaluation.kindOfTest : '---',
        evaluation.observations ? evaluation.observations : '---',
        evaluation.quantity ? evaluation.quantity : '---',

        // evaluation.status ? evaluation.status : '---',  
        evaluation.createdAt ? new Date(evaluation.createdAt['seconds'] * 1000) : '---',

        evaluation.workshop ? evaluation.workshop['location'] : evaluation.workshop ? evaluation.workshop : '---',

        evaluation.wof ? evaluation.wof : '---',
        evaluation.task ? evaluation.task : '---',
     
        evaluation.processAt ? new Date(evaluation.processAt['seconds'] * 1000) : '---',
        evaluation.finalizedAt ? new Date(evaluation.finalizedAt['seconds'] * 1000) : '---',
        evaluation.finalizedBy ? (evaluation.finalizedBy.name ? evaluation.finalizedBy.name : evaluation.finalizedBy) : '---',
        // evaluation.inquiryAt ? new Date(evaluation.inquiryAt['seconds'] * 1000) : '---',
      ]

      table_xlsx.push(temp);
    })


    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(table_xlsx);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');

    /* save to file */
    const name = 'Evaluaciones_Resultados' + '.xlsx';
    XLSX.writeFile(wb, name);
  }

  sortData(sort: Sort) {
    const data = this.historyEntries.slice();
    if (!sort.active || sort.direction === '') {
      this.historyDataSource.data = data;
      return;
    }

    this.historyDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'createdBy': return compare(a.createdBy.name, b.createdBy.name, isAsc);
        default: return 0;
      }
    });
  }

  filterWorkshopByCode(code: number): any{
    let filterWorkshop;

    const workshops = [
      {
        code: 5, location: 'MSH'
      },
      {
        code: 201306412, location: 'TMM'
      },
      {
        code: 1, location: 'CRC LIMA'
      },
      {
        code: 2, location: 'CRC LA JOYA'
      },
      {
        code: 3, location: 'TMAQ LIMA'
      },
      {
        code: 4, location: 'TH'
      },
      {
        code: 6, location: 'TMAQ LA JOYA'
      }
    ];

    workshops.filter(workshop => {
      if (workshop.code === code){
        filterWorkshop = workshop.location;
        }
    });


    return filterWorkshop ? filterWorkshop : '---';

  }

}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
