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

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [DatePipe]
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
    'specialist',
    'accCorrective',
    'riskLevel',
    'user',
    'state',
    'actions',
  ];
  @ViewChild('settingsPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.settingsDataSource.paginator = paginator;
  }

  quality$: Observable<Quality[]>;

  subscriptions = new Subscription();
  isMobile = false;

  dateForm: FormGroup;

  workShopControl = new FormControl('');
  eventTypeControl = new FormControl('');
  searchControl = new FormControl('');

  eventType = [
    {
      code: 'Interno', event: 'Internos'
    },
    {
      code: 'Externo', event: 'Externos'
    }
  ];

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private qualityService: QualityService,
    private auth: AuthService,
    private breakpoint: BreakpointObserver,
    private andonService: AndonService,
    private miDatePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const view = this.andonService.getCurrentMonthOfViewDate();

    const beginDate = view.from;
    const endDate = new Date();
    endDate.setHours(23, 59, 59);

    this.dateForm = new FormGroup({
      start: new FormControl(beginDate),
      end: new FormControl(endDate),
    });

    this.subscriptions.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      })
    )

    /* this.quality$ = this.qualityService.getAllQuality().pipe(
      tap((res: Quality[]) => {
        console.log('Quality', res);
        this.settingsDataSource.data = res;
      })
    ); */

    this.quality$ = combineLatest(
      this.qualityService.getAllQuality(),
      this.workShopControl.valueChanges.pipe(
        debounceTime(300),
        filter((input) => input !== null),
        startWith<any>('')
      ),
      this.eventTypeControl.valueChanges.pipe(
        debounceTime(300),
        filter((input) => input !== null),
        startWith<any>('')
      ),
      this.searchControl.valueChanges.pipe(
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
        map(end => end ? end.setHours(23, 59, 59) : null)
      )
    ).pipe(
      map(([qualities, workShop, codeEventType, search, startdate, enddate]) => {

        const date = { begin: startdate, end: enddate };

        const searchTerm = search.toLowerCase().trim();
        let preFilterSearch: Quality[] = [...qualities];
        let preFilterEventType: Quality[] = [];
        let preFilterWorkShop: Quality[] = [];


        if (codeEventType || workShop ) {
          preFilterEventType = qualities.filter(quality => quality.eventType === codeEventType);

          preFilterSearch = preFilterEventType.filter(quality => {
            return String(quality.workOrder).toLowerCase().includes(searchTerm) ||
            String(quality.component).toLowerCase().includes(searchTerm) ||
            String(quality.workShop).toLowerCase().includes(searchTerm) ;
          }).filter((quality) => {
            return this.getFilterTime(quality.createdAt, date);
          });

          if (workShop) {
            preFilterWorkShop = preFilterEventType.filter(quality => quality.workShop === workShop);

            preFilterSearch = preFilterWorkShop.filter(quality => {
              return String(quality.workOrder).toLowerCase().includes(searchTerm) ||
                String(quality.component).toLowerCase().includes(searchTerm) ||
                String(quality.workShop).toLowerCase().includes(searchTerm) ;
            }).filter((quality) => {
              return this.getFilterTime(quality.createdAt, date);
            });
          }

        } else {
          preFilterSearch = qualities.filter(quality => {
            return  String(quality.workOrder).toLowerCase().includes(searchTerm) ||
            String(quality.component).toLowerCase().includes(searchTerm) ||
            String(quality.workShop).toLowerCase().includes(searchTerm) ;
          }).filter((quality) => {
            return this.getFilterTime(quality.createdAt, date);
          });
        }

        return preFilterSearch;

      }),
      tap(res => {
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
      'Taller / Op Minera',
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

    this.settingsDataSource.data.forEach(element => {
      let  temp1 = [];
      let  temp2 = [];

      temp1 = [
        this.miDatePipe.transform(element['createdAt']['seconds'] * 1000, 'dd/MM/yyyy h:mm:ss a'),
        element.eventType ? element.eventType : '-',
        element.workOrder ? element.workOrder : '-',
        element.component ? element.component : '-',
        element.partNumber ? element.partNumber : '-',
        element.miningOperation ? element.miningOperation : '-',
        element.specialist ? element.specialist['workingArea'] : '-',
        element.evaluationAnalisis ? element.evaluationAnalisis : '-',
        element.createdBy ? element.createdBy.name : '',
        element.state ? element.state : ''
      ];

      element.correctiveActions.forEach( item2 => {
        temp2 = [
             ...temp1,
            item2['createdAt'] ? this.miDatePipe.transform(item2['createdAt']['seconds'] * 1000, 'dd/MM/yyyy h:mm:ss a') : '-' ,
            item2['corrective'] ? item2['corrective'] : '-',
            item2['name'] ? item2['name']['name'] : '-',
            item2['kit'] ? 'Finalizado' : 'Pendiente',
            item2['closedAt'] ? this.miDatePipe.transform(item2['closedAt']['seconds'] * 1000, 'dd/MM/yyyy h:mm:ss a') : '-',
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

  accCorrective(item): void{
    this.dialog.open(AccCorrectiveDialogComponent, {
      maxWidth: 900,
      width: '90vw',
      data: item
    });
  }

  timeline(item): void{
    this.dialog.open(TimeLineDialogComponent, {
      maxWidth: 900,
      width: '90vw',
      data: item
    });
  }

  deleteQuality(item): void{
    this.dialog.open(DeleteDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: item
    });
  }

  detailDialog(item: Quality, value: string): void {
    const optionsDialog = {
      maxWidth: 500,
      width: '90vw',
      data: item
    };
    let dialogRef;

    switch (value) {
      case 'Interno':
        dialogRef = this.dialog.open(DetailInternalDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
        });
        break;
      case 'Externo':
        dialogRef = this.dialog.open(DetailExternalDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
        });
        break;
    }
  }
  edit(item: Quality, value: string): void {
    const optionsDialog = {
      maxWidth: 700,
      width: '90vw',
      data: item
    };
    let dialogRef;

    switch (value) {
      case 'Interno':
        dialogRef = this.dialog.open(EditInternalDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
        });
        break;
      case 'Externo':
        dialogRef = this.dialog.open(EditExternalDialogComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
        });
        break;
    }
  }

}
