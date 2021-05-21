import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BudgetsService } from './../../../services/budgets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { budgetsExcelColumns } from './../../../models/budgets.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-budgets-daily-entries',
  templateUrl: './budgets-daily-entries.component.html',
  styleUrls: ['./budgets-daily-entries.component.scss'],
})
export class BudgetsDailyEntriesComponent implements OnInit {
  public budgetsDailyEntriesDataSource: MatTableDataSource<budgetsExcelColumns> =
    new MatTableDataSource<budgetsExcelColumns>();

  public budgetsDailyEntriesDisplayedColumns: Array<string> = [
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
    'informe',
    'cotizacionFesa',
    'cotizacionText',
    'excelid',
    'clave',
    'obj',
    'diasPPTO',
    'mesTer',
    'anio',
    'fechaLPD',
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

  constructor(
    private breakpoint: BreakpointObserver,
    private MatSnackBar: MatSnackBar,
    private BudgetsService: BudgetsService,
    private dialog: MatDialog
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
    let parsedExcelData: Array<budgetsExcelColumns> = [];

    // Remove the headers
    rawData.shift();

    if (rawData.length > 0) {
      // el is a row of the Excel sheet
      rawData.forEach((el) => {
        // if the row contains data
        if (el.length > 0) {
          // Format dates
          let _fechaAperturaChild;
          let _fechaReleasedIoChild;
          let _fechaUltimoListado;
          let _fechaUltimoEnvioDocumentoADM;
          let _fechaDefinicionDeCargos;
          let _fechaUltimoEnvioPPTO;
          let _fechaEnvioPPTO01;
          let _fechaEnvioPPTO02;
          let _fechaEnvioPPTO03;
          let _fechaEnvioPPTO04;
          let _fechaDeAprobacionORechazo;
          let _fechaDeTerminoDeRep;
          let _fechaUltimoInput;
          let _fechaDeFactDeTaller;
          let _mesFactVenta;
          let _fechaFirstLabour;
          let _fechaLastLabour;
          let _fechaLPD;
          let _resumen;
          let _informe;
          let _cotizacionFesa;
          let _cotizacionText;

          if (el[8]) _fechaAperturaChild = this.formatDate(el[8]);
          if (el[9]) _fechaReleasedIoChild = this.formatDate(el[9]);
          if (el[19]) _fechaUltimoListado = this.formatDate(el[19]);
          if (el[20]) _fechaUltimoEnvioDocumentoADM = this.formatDate(el[20]);
          if (el[22]) _fechaDefinicionDeCargos = this.formatDate(el[22]);
          if (el[24]) _fechaUltimoEnvioPPTO = this.formatDate(el[24]);
          if (el[25]) _fechaEnvioPPTO01 = this.formatDate(el[25]);
          if (el[26]) _fechaEnvioPPTO02 = this.formatDate(el[26]);
          if (el[29]) _fechaEnvioPPTO03 = this.formatDate(el[29]);
          if (el[32]) _fechaEnvioPPTO04 = this.formatDate(el[32]);
          if (el[35]) _fechaDeAprobacionORechazo = this.formatDate(el[35]);
          if (el[54]) _fechaDeTerminoDeRep = this.formatDate(el[54]);
          if (el[55]) _fechaUltimoInput = this.formatDate(el[55]);
          if (el[57]) _fechaDeFactDeTaller = this.formatDate(el[57]);
          if (el[70]) _mesFactVenta = this.formatDate(el[70]);
          if (el[72]) _fechaFirstLabour = this.formatDate(el[72]);
          if (el[73]) _fechaLastLabour = this.formatDate(el[73]);
          if (el[92]) _fechaLPD = this.formatDate(el[92]);

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

          const data: budgetsExcelColumns = {
            id: null,
            taller: el[0] ? el[0] : null,
            woMain: el[1] ? el[1] : null,
            ioMain: el[2] ? el[2] : null,
            woChild: el[3] ? el[3] : null,
            ioChild: el[4] ? el[4] : null,
            statusWoChild: el[5] ? el[5] : null,
            otTaller: el[6] ? el[6] : null,
            otMadre: el[7] ? el[7] : null,
            fechaAperturaChild: _fechaAperturaChild
              ? _fechaAperturaChild
              : null,
            fechaReleasedIoChild: _fechaReleasedIoChild
              ? _fechaReleasedIoChild
              : null,
            cliente: el[10] ? el[10] : null,
            gmorngm: el[11] ? el[11] : null,
            modelo: el[12] ? el[12] : null,
            tipoSS: el[13] ? el[13] : null,
            servicio: el[14] ? el[14] : null,
            tipoAtencion: el[15] ? el[15] : null,
            modalidadPresupuesto: el[16] ? el[16] : null,
            componente: el[17] ? el[17] : null,
            afa: el[18] ? el[18] : null,
            fechaUltimoListado: _fechaUltimoListado
              ? _fechaUltimoListado
              : null,
            fechaUltimoEnvioDocumentoADM: _fechaUltimoEnvioDocumentoADM
              ? _fechaUltimoEnvioDocumentoADM
              : null,
            ultimoDocumento: el[21] ? el[21] : null,
            fechaDefinicionDeCargos: _fechaDefinicionDeCargos
              ? _fechaDefinicionDeCargos
              : null,
            definicionDeCargo: el[23] ? el[23] : null,
            fechaUltimoEnvioPPTO: _fechaUltimoEnvioPPTO
              ? _fechaUltimoEnvioPPTO
              : null,
            fechaEnvioPPTO01: _fechaEnvioPPTO01 ? _fechaEnvioPPTO01 : null,
            fechaEnvioPPTO02: _fechaEnvioPPTO02 ? _fechaEnvioPPTO02 : null,
            motivoDeModificacion02: el[27] ? el[27] : null,
            detalleDeModificacion02: el[28] ? el[28] : null,
            fechaEnvioPPTO03: _fechaEnvioPPTO03 ? _fechaEnvioPPTO03 : null,
            motivoDeModificacion03: el[30] ? el[30] : null,
            detalleDeModificacion03: el[31] ? el[31] : null,
            fechaEnvioPPTO04: _fechaEnvioPPTO04 ? _fechaEnvioPPTO04 : null,
            motivoDeModificacion04: el[33] ? el[33] : null,
            detalleDeModificacion04: el[34] ? el[34] : null,
            fechaDeAprobacionORechazo: _fechaDeAprobacionORechazo
              ? _fechaDeAprobacionORechazo
              : null,
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
            fechaDeTerminoDeRep: _fechaDeTerminoDeRep
              ? _fechaDeTerminoDeRep
              : null,
            fechaUltimoInput: _fechaUltimoInput ? _fechaUltimoInput : null,
            motivoDeInput: el[56] ? el[56] : null,
            fechaDeFactDeTaller: _fechaDeFactDeTaller
              ? _fechaDeFactDeTaller
              : null,
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
            mesFactVenta: _mesFactVenta ? _mesFactVenta : null,
            percentHorasSTDvsHorasDBS: el[71] ? el[71] : null,
            fechaFirstLabour: _fechaFirstLabour ? _fechaFirstLabour : null,
            fechaLastLabour: _fechaLastLabour ? _fechaLastLabour : null,
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
            excelid: el[86] ? el[86] : null,
            clave: el[87] ? el[87] : null,
            obj: el[88] ? el[88] : null,
            diasPPTO: el[89] ? el[89] : null,
            mesTer: el[90] ? el[90] : null,
            anio: el[91] ? el[91] : null,
            fechaLPD: _fechaLPD ? _fechaLPD : null,
          };
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

  deleteDialog(index: number): void {
    const currentWOCHILD: string =
      this.budgetsDailyEntriesDataSource.data[index].woChild;

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { currentWOCHILD },
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then((res: string) => {
        if (res == 'delete') {
          this.budgetsDailyEntriesDataSource.data.splice(index, 1);
        }
        this.refresh();
        this.MatSnackBar.open('✅ Eliminado correctamente!', 'Aceptar', {
          duration: 6000,
        });
      });
  }

  // Function to refresh the mat-table data source
  refresh(): void {
    this.budgetsDailyEntriesDataSource.data =
      this.budgetsDailyEntriesDataSource.data;
  }

  uploadDataToFirestore(): void {
    this.loading.next(true);

    this.BudgetsService.getBudgets()
      .pipe(take(1))
      .subscribe((list) => {
        this.BudgetsService.uploadDailyExcelBatchArray(
          this.budgetsDailyEntriesDataSource.data,
          list
        ).subscribe((batchArray) => {
          if (batchArray.length > 0) {
            batchArray.forEach((batch) => {
              batch
                .commit()
                .then(() => {
                  this.loading.next(false);
                  this.MatSnackBar.open(
                    '✅ Archivo subido correctamente!',
                    'Aceptar',
                    {
                      duration: 6000,
                    }
                  );
                })
                .catch((err) => {
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
          }
        });
      });
  }
}
