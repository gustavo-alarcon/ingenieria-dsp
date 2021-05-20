import { MatSnackBar } from '@angular/material/snack-bar';
import { budgetsExcelColumns } from './../../../models/budgets.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import moment from 'moment';

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
    'fechaEnvioPPTO03',
    'motivoDeModificacion03',
    'detalleDeModificacion03',
    'fechaEnvioPPTO04',
    'motivoDeModificacion04',
    'detalleDeModificacion04',
    'fechaDeAprobacionORechazo',
    'statusPresupuesto',
    'vv$servicios',
    'vv$repuestos',
    'totalvvPPTOUS$',
    '$componenteNuevo',
    'reparacion60',
    'horasSTD',
    'horasReales',
    'tiempoObjetivoEnvioPPTO',
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

  public subscriptions: Subscription = new Subscription();
  public isMobile: boolean = false;

  constructor(
    private breakpoint: BreakpointObserver,
    private MatSnackBar: MatSnackBar
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

  public parseExcelData(rawData: any) {
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
          let _fechaFirstLabour;
          let _fechaLastLabour;
          let _fechaLPD;

          if (el[8]) _fechaAperturaChild = this.formatDate(el[8]);
          if (el[19]) _fechaUltimoListado = this.formatDate(el[19]);
          if (el[20]) _fechaUltimoEnvioDocumentoADM = this.formatDate(el[20]);
          if (el[22]) _fechaDefinicionDeCargos = this.formatDate(el[22]);
          if (el[24]) _fechaUltimoEnvioPPTO = this.formatDate(el[24]);
          if (el[25]) _fechaEnvioPPTO01 = this.formatDate(el[25]);
          if (el[26]) _fechaEnvioPPTO02 = this.formatDate(el[26]);
          if (el[28]) _fechaEnvioPPTO03 = this.formatDate(el[28]);
          if (el[31]) _fechaEnvioPPTO04 = this.formatDate(el[31]);
          if (el[34]) _fechaDeAprobacionORechazo = this.formatDate(el[34]);
          if (el[46]) _fechaDeTerminoDeRep = this.formatDate(el[46]);
          if (el[47]) _fechaUltimoInput = this.formatDate(el[47]);
          if (el[49]) _fechaDeFactDeTaller = this.formatDate(el[49]);
          if (el[64]) _fechaFirstLabour = this.formatDate(el[64]);
          if (el[65]) _fechaLastLabour = this.formatDate(el[65]);
          if (el[84]) _fechaLPD = this.formatDate(el[84]);

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
            fechaEnvioPPTO03: _fechaEnvioPPTO03 ? _fechaEnvioPPTO03 : null,
            motivoDeModificacion03: el[29] ? el[29] : null,
            detalleDeModificacion03: el[30] ? el[30] : null,
            fechaEnvioPPTO04: _fechaEnvioPPTO04 ? _fechaEnvioPPTO04 : null,
            motivoDeModificacion04: el[32] ? el[32] : null,
            detalleDeModificacion04: el[33] ? el[33] : null,
            fechaDeAprobacionORechazo: _fechaDeAprobacionORechazo
              ? _fechaDeAprobacionORechazo
              : null,
            statusPresupuesto: el[35] ? el[35] : null,
            vv$servicios: el[36] ? el[36] : null,
            vv$repuestos: el[37] ? el[37] : null,
            totalvvPPTOUS$: el[38] ? el[38] : null,
            $componenteNuevo: el[39] ? el[39] : null,
            reparacion60: el[40] ? el[40] : null,
            horasSTD: el[41] ? el[41] : null,
            horasReales: el[42] ? el[42] : null,
            tiempoObjetivoEnvioPPTO: el[43] ? el[43] : null,
            NoPPTOSModificadosOAdicionales: el[44] ? el[44] : null,
            observacionesEnElPresupuesto: el[45] ? el[45] : null,
            fechaDeTerminoDeRep: _fechaDeTerminoDeRep
              ? _fechaDeTerminoDeRep
              : null,
            fechaUltimoInput: _fechaUltimoInput ? _fechaUltimoInput : null,
            motivoDeInput: el[48] ? el[48] : null,
            fechaDeFactDeTaller: _fechaDeFactDeTaller
              ? _fechaDeFactDeTaller
              : null,
            costo$ServiciosCliente: el[50] ? el[50] : null,
            costo$ServiciosDeOperacion: el[51] ? el[51] : null,
            rentabilidadServiciosPercent: el[52] ? el[52] : null,
            costo$RepuestosCLIENTE: el[53] ? el[53] : null,
            costo$RepuestosOperacion: el[54] ? el[54] : null,
            rentabilidadRepuestosPercent: el[55] ? el[55] : null,
            observacionesTaller: el[56] ? el[56] : null,
            realDevueltoAServicios: el[57] ? el[57] : null,
            diferenciaServicios: el[58] ? el[58] : null,
            realDevueltoARepuestos: el[59] ? el[59] : null,
            diferenciaRepuestos: el[60] ? el[60] : null,
            totalVVFacturadoUS$: el[61] ? el[61] : null,
            mesFactVenta: el[62] ? el[62] : null,
            percentHorasSTDvsHorasDBS: el[63] ? el[63] : null,
            fechaFirstLabour: _fechaFirstLabour ? _fechaFirstLabour : null,
            fechaLastLabour: _fechaLastLabour ? _fechaLastLabour : null,
            diasDemoraFact: el[66] ? el[66] : null,
            diasFactLastLabour: el[67] ? el[67] : null,
            elaborarPPTO: el[68] ? el[68] : null,
            tipoDeComponente: el[69] ? el[69] : null,
            tipoAAorPandP: el[70] ? el[70] : null,
            taller02: el[71] ? el[71] : null,
            diasDesdeAperturaChild: el[72] ? el[72] : null,
            resumen: el[73] ? el[73] : null,
            definicionDeCargos: el[74] ? el[74] : null,
            informe: el[75] ? el[75] : null,
            cotizacionFesa: el[76] ? el[76] : null,
            cotizacionText: el[77] ? el[77] : null,
            excelid: el[78] ? el[78] : null,
            clave: el[79] ? el[79] : null,
            obj: el[80] ? el[80] : null,
            diasPPTO: el[81] ? el[81] : null,
            mesTer: el[82] ? el[82] : null,
            anio: el[83] ? el[83] : null,
            fechaLPD: _fechaLPD ? _fechaLPD : null,
          };
          parsedExcelData.push(data);
        }
      });

      this.budgetsDailyEntriesDataSource.data = parsedExcelData;
    } else {
      this.MatSnackBar.open('🚨 Archivo vacío ', 'Aceptar', {
        duration: 6000,
      });
    }
  }

  private formatDate(date: Date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  editDialog(): void {}
  deleteDialog(): void {}
  saveDataTable(): void {}
}
