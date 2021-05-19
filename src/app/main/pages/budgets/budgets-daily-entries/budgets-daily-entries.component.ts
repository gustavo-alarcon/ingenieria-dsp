import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Evaluation } from '../../../models/evaluations.model';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-budgets-daily-entries',
  templateUrl: './budgets-daily-entries.component.html',
  styleUrls: ['./budgets-daily-entries.component.scss'],
})
export class BudgetsDailyEntriesComponent implements OnInit {
  public budgetsDailyEntriesDataSource: MatTableDataSource<any> =
    new MatTableDataSource<any>();

  // public budgetsDailyEntriesDisplayedColumns: Array<string> = [
  //   'otMain',
  //   'otChild',
  //   'position',
  //   'partNumber',
  //   'description',
  //   'quantity',
  //   'status',
  //   'createdBy',
  //   'wof',
  //   'task',
  //   'observations',
  //   'workshop',
  //   'createdAt',
  //   'result',
  //   'kindOfTest',
  //   'comments',
  //   'finalizedBy',
  //   'processAt',
  //   'finalizedAt',
  // ];

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
    'id',
    'clave',
    'obj',
    'diasPPTO',
    'mesTer',
    'anio',
    'fechaLPD',
  ];

  @ViewChild('budgetsDailyEntriesPaginator', { static: false }) set content(
    paginator: MatPaginator
  ) {
    this.budgetsDailyEntriesDataSource.paginator = paginator;
  }

  public subscriptions: Subscription = new Subscription();
  public isMobile: boolean = false;

  constructor(private breakpoint: BreakpointObserver) {}

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
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      const sheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];

      console.log(XLSX.utils.sheet_to_json(sheet, { header: 1 }));
    };

    fileReader.readAsArrayBuffer(file);
  }

  editDialog(): void {}
  deleteDialog(): void {}
  saveDataTable(): void {}
}
