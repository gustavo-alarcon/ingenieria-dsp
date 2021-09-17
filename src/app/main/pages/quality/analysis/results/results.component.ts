import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Quality } from 'src/app/main/models/quality.model';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { QualityService } from '../../../../services/quality.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { tap, debounceTime, filter, startWith, map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { AccCorrectiveDialogComponent } from './dialogs/acc-corrective-dialog/acc-corrective-dialog.component';
import { TimeLineDialogComponent } from './dialogs/time-line-dialog/time-line-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AndonService } from 'src/app/main/services/andon.service';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';
import { EditExternalDialogComponent } from './dialogs/edit-external-dialog/edit-external-dialog.component';
import { EditInternalDialogComponent } from './dialogs/edit-internal-dialog/edit-internal-dialog.component';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { MatSort, Sort } from '@angular/material/sort';
import { WorkshopModel } from 'src/app/main/models/workshop.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [DatePipe],
})
export class ResultsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  settingsDataSource = new MatTableDataSource<Quality>();
  settingsDisplayedColumns: string[] = [
    'date',
    'eventType',
    'workOrder',
    'component',
    'numberPart',
    'workShop',
    'miningOperation',
    'specialist',
    'accCorrective',
    'causeFailure',
    'process',
    'riskLevel',
    'user',
    'state',
    'actions',
  ];
  @ViewChild(MatSort, { static: false }) set sortContent(sort: MatSort) {
    this.settingsDataSource.sort = sort;
  }
  @ViewChild('settingsPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.settingsDataSource.paginator = paginator;
  }

  quality$: Observable<Quality[]>;
  quality: Quality[];

  responsibleWorkshopList$: Observable<WorkshopModel[]>;
  workshopList$: Observable<any[]>;

  subscriptions = new Subscription();
  isMobile = false;

  dateForm: FormGroup;

  workShopControl = new FormControl('');
  eventTypeControl = new FormControl('');
  statusControl = new FormControl('');
  searchControl = new FormControl('');
  responsibleWorkshopControl = new FormControl('');

  eventType = [
    {
      code: 'Interno',
      event: 'Internos',
    },
    {
      code: 'Externo',
      event: 'Externos',
    },
  ];
  //  state?: string; // => registered / process / tracing / finalized

  status = [
    {
      code: 'registered',
      name: 'Registro',
    },
    {
      code: 'process',
      name: 'Proceso',
    },
    {
      code: 'tracing',
      name: 'Siguimiento',
    },
    {
      code: 'finalized',
      name: 'Finalizado',
    },
  ];

  constructor(
    public dialog: MatDialog,
    private qualityService: QualityService,
    private breakpoint: BreakpointObserver,
    private andonService: AndonService,
    private miDatePipe: DatePipe,
    public authService: AuthService
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

    const view = this.andonService.getCurrentMonthOfViewDate();

    const beginDate = view.from;
    const endDate = new Date();
    endDate.setHours(23, 59, 59);

    this.dateForm = new FormGroup({
      start: new FormControl(beginDate),
      end: new FormControl(endDate),
    });

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

    this.responsibleWorkshopList$ =
      this.qualityService.getAllQualityInternalWorkshop();

    this.workshopList$ = this.qualityService.getAllWorkshopList();

    this.quality$ = combineLatest(
      this.qualityService.getAllQuality(),
      this.workShopControl.valueChanges.pipe(startWith('')),
      this.responsibleWorkshopControl.valueChanges.pipe(startWith('')),
      this.statusControl.valueChanges.pipe(
        debounceTime(300),
        filter((input) => input !== null),
        startWith('')
      ),
      this.eventTypeControl.valueChanges.pipe(
        debounceTime(300),
        filter((input) => input !== null),
        startWith('')
      ),
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        filter((input) => input !== null),
        startWith('')
      ),
      this.dateForm.get('start').valueChanges.pipe(
        startWith(beginDate),
        map((begin) => begin.setHours(0, 0, 0, 0))
      ),
      this.dateForm.get('end').valueChanges.pipe(
        startWith(endDate),
        map((end) => (end ? end.setHours(23, 59, 59) : null))
      )
    ).pipe(
      map(
        ([
          qualities,
          workshop,
          responsibleWorkshop,
          status,
          codeEventType,
          search,
          startdate,
          enddate,
        ]) => {
          const date = { begin: startdate, end: enddate };

          const searchTerm = search.toLowerCase().trim();
          let preFilterSearch: Quality[] = [...qualities];
          let preFilterEventType: Quality[] = [];
          let preFilterWorkShop: Quality[] = [];
          let preFilterResponsibleWorkshop: Quality[] = [];
          let preFilterStatus: Quality[] = [];

          preFilterEventType = qualities.filter((quality) => {
            if (codeEventType === '') return true;
            return quality.eventType === codeEventType;
          });

          preFilterStatus = preFilterEventType.filter((quality) => {
            if (status === '') return true;
            return quality.state === status;
          });

          preFilterWorkShop = preFilterStatus.filter((quality) => {
            if (workshop === '') return true;
            return quality.workShop === workshop['name'];
          });

          preFilterResponsibleWorkshop = preFilterWorkShop.filter((quality) => {
            if (responsibleWorkshop === '') return true;
            return quality.responsibleWorkshop
              ? quality.responsibleWorkshop.workshopName ===
                  responsibleWorkshop['workshopName']
              : false;
          });

          preFilterSearch = preFilterResponsibleWorkshop
            .filter((quality) => {
              return (
                String(quality.workOrder).toLowerCase().includes(searchTerm) ||
                String(quality.component).toLowerCase().includes(searchTerm) ||
                String(quality.workShop).toLowerCase().includes(searchTerm) ||
                String(quality.enventDetail)
                  .toLowerCase()
                  .includes(searchTerm) ||
                String(quality.evaluationAnalysisName)
                  .toLowerCase()
                  .includes(searchTerm) ||
                String(quality.specialist ? quality.specialist['name'] : '')
                  .toLowerCase()
                  .includes(searchTerm) ||
                String(quality.createdBy ? quality.createdBy['name'] : '')
                  .toLowerCase()
                  .includes(searchTerm) ||
                String(quality.analysis ? quality.analysis['causeFailure'] : '')
                  .toLowerCase()
                  .includes(searchTerm) ||
                String(quality.analysis ? quality.analysis['process'] : '')
                  .toLowerCase()
                  .includes(searchTerm) ||
                String(quality.partNumber).toLowerCase().includes(searchTerm) ||
                String(quality.packageNumber)
                  .toLowerCase()
                  .includes(searchTerm) ||
                String(quality.miningOperation)
                  .toLowerCase()
                  .includes(searchTerm) ||
                String(quality.componentHourMeter)
                  .toLowerCase()
                  .includes(searchTerm)
              );
            })
            .filter((quality) => {
              return this.getFilterTime(quality.createdAt, date);
            });

          return preFilterSearch;
        }
      ),
      tap((res) => {
        this.quality = res;
        this.settingsDataSource.data = res;
      })
    );
  }

  getFilterTime(el, time): any {
    const date = el.toMillis();
    const begin = time.begin;
    const end = time.end;
    return date >= begin && date <= end;
  }

  download(): void {
    let table_xlsx: any[] = [];

    const headersXlsx = [
      'Fecha',
      'Tipo de evento',
      'Orden de trabajo',
      'Componente',
      'Nro de parte',
      'Taller',
      'Operacion Minera',
      'Detalle de evento',
      'Numero de plaqueteo',
      'Pregunta 1',
      'Pregunta 2',
      'Pregunta 3',
      'Pregunta 4',
      'Proceso',
      'Causante de falla',
      'Especialista',
      'Nivel de riesgo',
      'Usuario',
      'Estado',
      'Fecha de inicio de accion correctiva',
      'Accion correctiva',
      'Area responsable',
      'Estado',
      'Fecha de finalizacion de accion correctiva',
      'Responsable de implemento',
    ];

    table_xlsx.push(headersXlsx);

    this.settingsDataSource.data.forEach((element) => {
      let temp1 = [];
      let temp2 = [];

      temp1 = [
        this.miDatePipe.transform(
          element['createdAt']['seconds'] * 1000,
          'dd/MM/yyyy h:mm:ss a'
        ),
        element.eventType ? element.eventType : '-',
        element.workOrder ? element.workOrder : '-',
        element.component ? element.component : '-',
        element.partNumber ? element.partNumber : '-',
        element.workShop ? element.workShop : '-',
        element.miningOperation ? element.miningOperation : '-',
        element.enventDetail ? element.enventDetail : '-',
        element.packageNumber ? element.packageNumber : '-',
        element.question1 ? element.question1 : '-',
        element.question2 ? element.question2 : '-',
        element.question3 ? element.question3 : '-',
        element.question4 ? element.question4 : '-',
        element.analysis ? element.analysis['process'] : '-',
        element.analysis ? element.analysis['causeFailure'] : '-',
        element.specialist ? element.specialist['workingArea'] : '-',
        element.evaluationAnalysisName ? element.evaluationAnalysisName : '-',
        element.createdBy ? element.createdBy.name : '',
        element.state ? element.state : '',
      ];

      element.correctiveActions.forEach((item2) => {
        temp2 = [
          ...temp1,
          item2['createdAt']
            ? this.miDatePipe.transform(
                item2['createdAt']['seconds'] * 1000,
                'dd/MM/yyyy h:mm:ss a'
              )
            : '-',
          item2['corrective'] ? item2['corrective'] : '-',
          item2['name'] ? item2['name']['name'] : '-',
          item2['kit'] ? 'Finalizado' : 'Pendiente',
          item2['closedAt']
            ? this.miDatePipe.transform(
                item2['closedAt']['seconds'] * 1000,
                'dd/MM/yyyy h:mm:ss a'
              )
            : '-',
          item2['user'] ? item2['user']['name'] : '-',
        ];

        table_xlsx.push(temp2);
      });
    });

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(table_xlsx);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'data_for_user');

    /* save to file */
    const name = 'result_list' + '.xlsx';
    XLSX.writeFile(wb, name);
  }

  accCorrective(item): void {
    this.dialog.open(AccCorrectiveDialogComponent, {
      maxWidth: 900,
      width: '90vw',
      data: item,
    });
  }

  printPdf(item: Quality) {
    this.qualityService.printQualityPdf(item);
  }

  timeline(item): void {
    this.dialog.open(TimeLineDialogComponent, {
      maxWidth: 900,
      width: '90vw',
      data: item,
    });
  }

  deleteQuality(item): void {
    this.dialog.open(DeleteDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item,
    });
  }

  detailDialog(item: Quality, value: string): void {
    const optionsDialog = {
      maxWidth: 500,
      width: '90vw',
      data: item,
    };
    let dialogRef;

    switch (value) {
      case 'Interno':
        dialogRef = this.dialog.open(
          DetailInternalDialogComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {});
        break;
      case 'Externo':
        dialogRef = this.dialog.open(
          DetailExternalDialogComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {});
        break;
    }
  }
  edit(item: Quality, value: string): void {
    const optionsDialog = {
      maxWidth: 700,
      width: '90vw',
      data: item,
    };
    let dialogRef;

    switch (value) {
      case 'Interno':
        dialogRef = this.dialog.open(
          EditInternalDialogComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {});
        break;
      case 'Externo':
        dialogRef = this.dialog.open(
          EditExternalDialogComponent,
          optionsDialog
        );

        dialogRef.afterClosed().subscribe((result) => {});
        break;
    }
  }

  sortData(sort: Sort) {
    const data = this.quality.slice();

    if (!sort.active || sort.direction === '') {
      this.settingsDataSource.data = data;

      return;
    }

    this.settingsDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'user':
          return compare(a.createdBy.name, b.createdBy.name, isAsc);
        case 'specialist':
          return compare(a.specialist, b.specialist, isAsc);
        case 'date':
          return compare(a.createdAt['seconds'], b.createdAt['seconds'], isAsc);
        case 'process':
          return compare(
            a.analysis ? a.analysis['process'] : 0,
            b.analysis ? b.analysis['process'] : 0,
            isAsc
          );
        case 'causeFailure':
          return compare(
            a.analysis ? a.analysis['causeFailure'] : 0,
            b.analysis ? b.analysis['causeFailure'] : 0,
            isAsc
          );
        case 'accCorrective':
          return compare(a.taskDone, b.taskDone, isAsc);
        case 'riskLevel':
          return compare(
            a.evaluationAnalysisName ? a.evaluationAnalysisName : 0,
            b.evaluationAnalysisName ? b.evaluationAnalysisName : 0,
            isAsc
          );
        case 'numberPart':
          return compare(
            a.packageNumber ? a.partNumber : 0,
            b.partNumber ? b.partNumber : 0,
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
