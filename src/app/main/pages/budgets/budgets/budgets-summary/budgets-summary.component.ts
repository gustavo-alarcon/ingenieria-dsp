import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { budgetsExcelColumns } from './../../../../models/budgets.model';
import { take } from 'rxjs/operators';
import { BudgetsService } from './../../../../services/budgets.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-budgets-summary',
  templateUrl: './budgets-summary.component.html',
  styleUrls: ['./budgets-summary.component.scss'],
})
export class BudgetsSummaryComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public auth: AuthService,
    private breakpoint: BreakpointObserver,
    private _budgetsService: BudgetsService
  ) {}

  public searchBoxes: Array<any> = [
    { placeholder: 'Taller', icon: 'business' },
    { placeholder: 'WO MAIN', icon: 'search' },
    { placeholder: 'WO CHILD', icon: 'search' },
    { placeholder: 'CLIENTE', icon: 'search' },
    { placeholder: 'STATUS PPTO', icon: 'search' },
  ];

  public tableData: MatTableDataSource<budgetsExcelColumns> =
    new MatTableDataSource<budgetsExcelColumns>();

  public displayedColumns = [
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
  ];

  public subscriptions: Subscription = new Subscription();

  public isMobile: boolean = false;

  public cantWO: number = 0;

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

    this._budgetsService
      .getBudgets()
      .pipe()
      .subscribe((res) => {
        this.tableData.data = res;
        console.log('Budgets collection: ', this.tableData);
      });
  }

  public ngAfterViewInit(): void {
    this.tableData.sort = this.sort;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
