import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BudgetsService } from './../../../services/budgets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Budget } from './../../../models/budgets.model';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { documentVersion } from '../../../models/budgets.model';
import { object } from 'firebase-functions/lib/providers/storage';

@Component({
  selector: 'app-budgets-daily-entries',
  templateUrl: './budgets-daily-entries.component.html',
  styleUrls: ['./budgets-daily-entries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsDailyEntriesComponent implements OnInit {
  public budgetUploaded: boolean = false;

  public budgetsDailyEntriesDataSource: MatTableDataSource<Budget> =
    new MatTableDataSource<Budget>();

  public budgetsDailyEntriesDisplayedColumns: Array<string> = [
    'checkUpgrade',
    'taller',
    'woMain',
    'ioMain',
    'woChild',
    'ioChild',
    'statusWoChild',
    'otTaller',
    'otMadre',
    'fechaAperturaChild',
    'fechaReleasedIoChild',
    'cliente',
    'gmorngm',
    'modelo',
    'tipoSS',
    'servicio',
    'tipoAtencion',
    'modalidadPresupuesto',
    'componente',
    'afa',
    'fechaUltimoListado',
    'fechaUltimoEnvioDocumentoADM',
    'ultimoDocumento',
    'fechaDefinicionDeCargos',
    'definicionDeCargo',
    'fechaUltimoEnvioPPTO',
    'fechaEnvioPPTO01',
    'fechaEnvioPPTO02',
    'motivoDeModificacion02',
    'detalleDeModificacion02',
    'fechaEnvioPPTO03',
    'motivoDeModificacion03',
    'detalleDeModificacion03',
    'fechaEnvioPPTO04',
    'motivoDeModificacion04',
    'detalleDeModificacion04',
    'fechaDeAprobacionORechazo',
    'fechaReleasedIoChild',
    'statusPresupuesto',
    'motivoDelRechazo',
    'detalleDelRechazo',
    'vv$servicios',
    'vv$adicionalesServicios',
    'vv$descuentoServicios',
    'vv$repuestos',
    'vv$adicionalesRepuestos',
    'vv$descuentoRepuestos',
    'totalvvPPTOUS$',
    '$componenteNuevo',
    'reparacion60',
    'horasSTD',
    'horasReales',
    'tiempoObjetivoEnvioPPTO',
    'diasRestantesEnvioPPTO',
    'NoPPTOSModificadosOAdicionales',
    'observacionesEnElPresupuesto',
    'fechaDeTerminoDeRep',
    'fechaUltimoInput',
    'motivoDeInput',
    'fechaDeFactDeTaller',
    'costo$ServiciosCliente',
    'costo$ServiciosDeOperacion',
    'rentabilidadServiciosPercent',
    'costo$RepuestosCLIENTE',
    'costo$RepuestosOperacion',
    'rentabilidadRepuestosPercent',

    'observacionesTaller',
    'realDevueltoAServicios',
    'diferenciaServicios',
    'realDevueltoARepuestos',
    'diferenciaRepuestos',
    'totalVVFacturadoUS$',
    'mesFactVenta',
    'percentHorasSTDvsHorasDBS',
    'fechaFirstLabour',
    'fechaLastLabour',
    'diasDemoraFact',
    'diasFactLastLabour',
    'elaborarPPTO',
    'tipoDeComponente',
    'tipoAAorPandP',
    'taller02',
    'diasDesdeAperturaChild',
    'resumen',
    'definicionDeCargos',
    'afa',
    'informe',
    'cotizacionFesa',
    'cotizacionText',
    'statusFacturacion',
    // 'excelid',
    // 'clave',
    // 'obj',
    // 'diasPPTO',
    // 'mesTer',
    // 'anio',
    // 'fechaLPD',
    'actions',
  ];

  @ViewChild('budgetsDailyEntriesPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.budgetsDailyEntriesDataSource.paginator = paginator;
  }

  @ViewChild('loadFileInputElement') loadFileInputElementRef: ElementRef;

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

  public subscriptions: Subscription = new Subscription();
  public isMobile: boolean = false;

  setUpgrade: boolean = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private MatSnackBar: MatSnackBar,
    private BudgetsService: BudgetsService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  public ngOnInit(): void {
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
  }

  public loadFile(fileList: File[]): void {
    this.budgetUploaded = false;
    this.loading.next(true);
    const file: File = fileList[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onload = () => {
      const data: Uint8Array = new Uint8Array(
        fileReader.result as ArrayBufferLike
      );
      const workbook: XLSX.WorkBook = XLSX.read(data, {
        type: 'array',
        cellDates: true,
      });
      const sheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      });

      this.parseExcelData(rawData);
    };

    fileReader.readAsArrayBuffer(file);
  }

  public parseExcelData(rawData: any): void {
    let parsedExcelData: Array<Budget> = [];

    // Remove the headers
    rawData.shift();

    if (rawData.length > 0) {
      // el is a row of the Excel sheet
      rawData.forEach((el) => {
        // if the row contains data
        if (el.length > 0) {
          // Format dates
          let _resumen;
          let _informe;
          let _cotizacionFesa;
          let _cotizacionText;

          _resumen =
            Object.prototype.toString.call(el[81]) === '[object Date]'
              ? this.formatDate(el[81])
              : el[81];

          _informe =
            Object.prototype.toString.call(el[83]) === '[object Date]'
              ? this.formatDate(el[83])
              : el[83];

          _cotizacionFesa =
            Object.prototype.toString.call(el[84]) === '[object Date]'
              ? this.formatDate(el[84])
              : el[84];

          _cotizacionText =
            Object.prototype.toString.call(el[85]) === '[object Date]'
              ? this.formatDate(el[85])
              : el[85];

          const data: Budget = {
            id: null,
            taller: el[0] ? el[0] : null,
            woMain: el[1] ? el[1] : null,
            ioMain: el[2] ? el[2] : null,
            woChild: el[3] ? el[3] : null,
            ioChild: el[4] ? el[4] : null,
            statusWoChild: el[5] ? el[5] : null,
            otTaller: el[6] ? el[6] : null,
            otMadre: el[7] ? el[7] : null,
            fechaAperturaChild: el[8] ? el[8] : null,
            fechaReleasedIoChild: el[9] ? el[9] : null,
            cliente: el[10] ? el[10] : null,
            gmorngm: el[11] ? el[11] : null,
            modelo: el[12] ? el[12] : null,
            tipoSS: el[13] ? el[13] : null,
            servicio: el[14] ? el[14] : null,
            tipoAtencion: el[15] ? el[15] : null,
            modalidadPresupuesto: el[16] ? el[16] : null,
            componente: el[17] ? el[17] : null,
            afa: el[18] ? el[18] : null,
            fechaUltimoListado: el[19] ? el[19] : null,
            fechaUltimoEnvioDocumentoADM: el[20] ? el[20] : null,
            ultimoDocumento: el[21] ? el[21] : null,
            fechaDefinicionDeCargos: el[22] ? el[22] : null,
            definicionDeCargo: el[23] ? el[23] : null,
            fechaUltimoEnvioPPTO: el[24] ? el[24] : null,
            fechaEnvioPPTO01: el[25] ? el[25] : null,
            fechaEnvioPPTO02: el[26] ? el[26] : null,
            motivoDeModificacion02: el[27] ? el[27] : null,
            detalleDeModificacion02: el[28] ? el[28] : null,
            fechaEnvioPPTO03: el[29] ? el[29] : null,
            motivoDeModificacion03: el[30] ? el[30] : null,
            detalleDeModificacion03: el[31] ? el[31] : null,
            fechaEnvioPPTO04: el[32] ? el[32] : null,
            motivoDeModificacion04: el[33] ? el[33] : null,
            detalleDeModificacion04: el[34] ? el[34] : null,
            fechaDeAprobacionORechazo: el[35] ? el[35] : null,
            statusPresupuesto: el[36] ? el[36] : null,
            motivoDelRechazo: el[37] ? el[37] : null,
            detalleDelRechazo: el[38] ? el[38] : null,
            vv$servicios: el[39] ? el[39] : null,
            vv$adicionalesServicios: el[40] ? el[40] : null,
            vv$descuentoServicios: el[41] ? el[41] : null,
            vv$repuestos: el[42] ? el[42] : null,
            vv$adicionalesRepuestos: el[43] ? el[43] : null,
            vv$descuentoRepuestos: el[44] ? el[44] : null,
            totalvvPPTOUS$: el[45] ? el[45] : null,
            $componenteNuevo: el[46] ? el[46] : null,
            reparacion60: el[47] ? el[47] : null,
            horasSTD: el[48] ? el[48] : null,
            horasReales: el[49] ? el[49] : null,
            tiempoObjetivoEnvioPPTO: el[50] ? el[50] : null,
            diasRestantesEnvioPPTO: el[51] ? el[51] : null,
            NoPPTOSModificadosOAdicionales: el[52] ? el[52] : null,
            observacionesEnElPresupuesto: el[53] ? el[53] : null,
            fechaDeTerminoDeRep: el[54] ? el[54] : null,
            fechaUltimoInput: el[55] ? el[55] : null,
            motivoDeInput: el[56] ? el[56] : null,
            fechaDeFactDeTaller: el[57] ? el[57] : null,
            costo$ServiciosCliente: el[58] ? el[58] : null,
            costo$ServiciosDeOperacion: el[59] ? el[59] : null,
            rentabilidadServiciosPercent: el[60] ? el[60] : null,
            costo$RepuestosCLIENTE: el[61] ? el[61] : null,
            costo$RepuestosOperacion: el[62] ? el[62] : null,
            rentabilidadRepuestosPercent: el[63] ? el[63] : null,
            observacionesTaller: el[64] ? el[64] : null,
            realDevueltoAServicios: el[65] ? el[65] : null,
            diferenciaServicios: el[66] ? el[66] : null,
            realDevueltoARepuestos: el[67] ? el[67] : null,
            diferenciaRepuestos: el[68] ? el[68] : null,
            totalVVFacturadoUS$: el[69] ? el[69] : null,
            mesFactVenta: el[70] ? el[70] : null,
            percentHorasSTDvsHorasDBS: el[71] ? el[71] : null,
            fechaFirstLabour: el[72] ? el[72] : null,
            fechaLastLabour: el[73] ? el[73] : null,
            diasDemoraFact: el[74] ? el[74] : null,
            diasFactLastLabour: el[75] ? el[75] : null,
            elaborarPPTO: el[76] ? el[76] : null,
            tipoDeComponente: el[77] ? el[77] : null,
            tipoAAorPandP: el[78] ? el[78] : null,
            taller02: el[79] ? el[79] : null,
            diasDesdeAperturaChild: el[80] ? el[80] : null,
            resumen: _resumen ? _resumen : null,
            definicionDeCargos: el[82] ? el[82] : null,
            informe: _informe ? _informe : null,
            cotizacionFesa: _cotizacionFesa ? _cotizacionFesa : null,
            cotizacionText: _cotizacionText ? _cotizacionText : null,
            statusFacturacion: el[86] ? el[86] : null,
            excelid: el[87] ? el[87] : null,
            clave: el[88] ? el[88] : null,
            obj: el[89] ? el[89] : null,
            diasPPTO: el[90] ? el[90] : null,
            mesTer: el[91] ? el[91] : null,
            anio: el[92] ? el[92] : null,
            fechaLPD: el[93] ? el[93] : null,
            motivoDeModificacion: el[94] ? el[94] : null
          };
          data['checkUpgrade'] = this.BudgetsService.checkBudgetConflicts(data);
          data['applyUpgrade'] = false;
          data['duplicated'] = false;
          data['budgetId'] = null;

          parsedExcelData.push(data);
        }
      });

      this.budgetsDailyEntriesDataSource.data = parsedExcelData;
      this.loadFileInputElementRef.nativeElement.value = null;
      this.loading.next(false);
    } else {
      this.MatSnackBar.open('🚨 Archivo vacío ', 'Aceptar', {
        duration: 6000,
      });
    }
  }

  private formatDate(date: Date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  deleteDialog(element: any): void {
    const currentWOCHILD: number =
      this.budgetsDailyEntriesDataSource.data[
        this.budgetsDailyEntriesDataSource.filteredData.indexOf(element)
      ].woChild;

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { currentWOCHILD },
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then((res: string) => {
        if (res == 'delete') {
          this.budgetsDailyEntriesDataSource.data.splice(
            this.budgetsDailyEntriesDataSource.filteredData.indexOf(element),
            1
          );
          this.MatSnackBar.open('✅ Eliminado correctamente!', 'Aceptar', {
            duration: 6000,
          });
        }
        this.refresh();
      });
  }

  // Function to refresh the mat-table data source
  refresh(): void {
    this.budgetsDailyEntriesDataSource.data =
      this.budgetsDailyEntriesDataSource.data;
  }

  uploadDataToFirestore(): void {
    this.loading.next(true);

    this.BudgetsService.uploadDailyEntries(
      this.budgetsDailyEntriesDataSource.data
    )
      .pipe(take(1))
      .subscribe((batchList) => {
        batchList.forEach((batch, index) => {
          batch
            .commit()
            .then(() => {
              this.budgetsDailyEntriesDataSource.data.length = 0;
              this.refresh();
              this.loading.next(false);
              this.MatSnackBar.open(
                '✅ Archivo subido correctamente!',
                'Aceptar',
                {
                  duration: 6000,
                }
              );
              this.budgetUploaded = true;
            })
            .catch((error) => {
              console.error(error);
              this.loading.next(false);
              this.MatSnackBar.open(
                '🚨 Hubo un error subiendo el archivo.',
                'Aceptar',
                {
                  duration: 6000,
                }
              );
            });
        });
      });
    // this.BudgetsService.getBudgetsSnapshot()
    //   .pipe(take(1))
    //   .subscribe((firestoreBudgetsSnapshot) => {
    //     this.BudgetsService.uploadDailyExcelBatchArray(
    //       this.budgetsDailyEntriesDataSource.data,
    //       firestoreBudgetsSnapshot
    //     )
    //       .pipe(take(1))
    //       .subscribe((batchArray) => {
    //         batchArray.forEach((batch) => {
    //           batch
    //             .commit()
    //             .then(() => {
    //               this.budgetsDailyEntriesDataSource.data.length = 0;
    //               this.refresh();
    //               this.loading.next(false);
    //               this.MatSnackBar.open(
    //                 '✅ Archivo subido correctamente!',
    //                 'Aceptar',
    //                 {
    //                   duration: 6000,
    //                 }
    //               );
    //               this.budgetUploaded = true;
    //             })
    //             .catch((error) => {
    //               console.error(error);
    //               this.loading.next(false);
    //               this.MatSnackBar.open(
    //                 '🚨 Hubo un error subiendo el archivo.',
    //                 'Aceptar',
    //                 {
    //                   duration: 6000,
    //                 }
    //               );
    //             });
    //         });
    //       });
    //   });
  }

  cancelUploadDataToFirestore(): void {
    this.budgetsDailyEntriesDataSource.data.length = 0;
    this.refresh();
  }

  public goToBudgets(): void {
    this.router.navigate(['main/budgets/summary']);
  }

  markAsDuplicated(index: number): void {
    this.budgetsDailyEntriesDataSource.data[index]['duplicated'] = true;
  }

  applyUpgrade(budgetDifferences: Budget, index: number, id: string) {
    this.budgetsDailyEntriesDataSource.data[index]['applyUpgrade'] = true;
    this.budgetsDailyEntriesDataSource.data[index]['budgetDifferences'] =
      budgetDifferences;
    this.budgetsDailyEntriesDataSource.data[index]['budgetId'] = id;
    console.log(id);
  }

  cancelUpgrade(index: number) {
    this.budgetsDailyEntriesDataSource.data[index]['applyUpgrade'] = false;
    this.budgetsDailyEntriesDataSource.data[index]['budgetDifferences'] = {};
  }
}
