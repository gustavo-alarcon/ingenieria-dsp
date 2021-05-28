import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { budgetsExcelColumns } from './../../../../models/budgets.model';
import { take } from 'rxjs/operators';
import { BudgetsService } from './../../../../services/budgets.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-budgets-summary',
  templateUrl: './budgets-summary.component.html',
  styleUrls: ['./budgets-summary.component.scss'],
})
export class BudgetsSummaryComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public auth: AuthService,
    private breakpoint: BreakpointObserver,
    private _budgetsService: BudgetsService
  ) {}

  // Form controllers
  public tallerFormControl: FormControl = new FormControl();
  public woMainFormControl: FormControl = new FormControl();
  public woChildFormControl: FormControl = new FormControl();
  public clienteFormControl: FormControl = new FormControl();
  public statusFormControl: FormControl = new FormControl();

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
    'actions'
  ];

  public filteredValues = {
    taller: '',
    woMain: '',
    ioMain: '',
    woChild: '',
    ioChild: '',
    statusWoChild: '',
    otTaller: '',
    otMadre: '',
    fechaAperturaChild: '',
    fechaReleasedIoChild: '',
    cliente: '',
    gmorngm: '',
    modelo: '',
    tipoSS: '',
    servicio: '',
    tipoAtencion: '',
    modalidadPresupuesto: '',
    componente: '',
    afa: '',
    fechaUltimoListado: '',
    fechaUltimoEnvioDocumentoADM: '',
    ultimoDocumento: '',
    fechaDefinicionDeCargos: '',
    definicionDeCargo: '',
    fechaUltimoEnvioPPTO: '',
    fechaEnvioPPTO01: '',
    fechaEnvioPPTO02: '',
    motivoDeModificacion02: '',
    detalleDeModificacion02: '',
    fechaEnvioPPTO03: '',
    motivoDeModificacion03: '',
    detalleDeModificacion03: '',
    fechaEnvioPPTO04: '',
    motivoDeModificacion04: '',
    detalleDeModificacion04: '',
    fechaDeAprobacionORechazo: '',
    statusPresupuesto: '',
    motivoDelRechazo: '',
    detalleDelRechazo: '',
    vv$servicios: '',
    vv$adicionalesServicios: '',
    vv$descuentoServicios: '',
    vv$repuestos: '',
    vv$adicionalesRepuestos: '',
    vv$descuentoRepuestos: '',
    totalvvPPTOUS$: '',
    $componenteNuevo: '',
    reparacion60: '',
    horasSTD: '',
    horasReales: '',
    tiempoObjetivoEnvioPPTO: '',
    diasRestantesEnvioPPTO: '',
    NoPPTOSModificadosOAdicionales: '',
    observacionesEnElPresupuesto: '',
    fechaDeTerminoDeRep: '',
    fechaUltimoInput: '',
    motivoDeInput: '',
    fechaDeFactDeTaller: '',
    costo$ServiciosCliente: '',
    costo$ServiciosDeOperacion: '',
    rentabilidadServiciosPercent: '',
    costo$RepuestosCLIENTE: '',
    costo$RepuestosOperacion: '',
    rentabilidadRepuestosPercent: '',
    observacionesTaller: '',
    realDevueltoAServicios: '',
    diferenciaServicios: '',
    realDevueltoARepuestos: '',
    diferenciaRepuestos: '',
    totalVVFacturadoUS$: '',
    mesFactVenta: '',
    percentHorasSTDvsHorasDBS: '',
    fechaFirstLabour: '',
    fechaLastLabour: '',
    diasDemoraFact: '',
    diasFactLastLabour: '',
    elaborarPPTO: '',
    tipoDeComponente: '',
    tipoAAorPandP: '',
    taller02: '',
    diasDesdeAperturaChild: '',
    resumen: '',
    definicionDeCargos: '',
    informe: '',
    cotizacionFesa: '',
    cotizacionText: '',
    excelid: '',
    clave: '',
    obj: '',
    diasPPTO: '',
    mesTer: '',
    anio: '',
    fechaLPD: '',
  };

  public subscriptions: Subscription = new Subscription();

  public isMobile: boolean = false;

  public cantWO: number = 0;

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

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
    this.loading.next(true);
  }

  public ngAfterViewInit(): void {
    this.tableData.sort = this.sort;
    this.tableData.paginator = this.paginator;
    this._budgetsService
      .getBudgets()
      .pipe()
      .subscribe((res) => {
        this.tableData.data = res;
        this.cantWO = this.tableData.data.length;

        this.tallerFormControl.valueChanges.subscribe((val) => {
          this.filteredValues['taller'] = val;
          this.tableData.filter = JSON.stringify(this.filteredValues);
        });

        this.woMainFormControl.valueChanges.subscribe((val) => {
          this.filteredValues['woMain'] = val;
          this.tableData.filter = JSON.stringify(this.filteredValues);
        });

        this.woChildFormControl.valueChanges.subscribe((val) => {
          this.filteredValues['woChild'] = val;
          this.tableData.filter = JSON.stringify(this.filteredValues);
        });

        this.clienteFormControl.valueChanges.subscribe((val) => {
          this.filteredValues['cliente'] = val;
          this.tableData.filter = JSON.stringify(this.filteredValues);
        });

        this.statusFormControl.valueChanges.subscribe((val) => {
          this.filteredValues['statusPresupuesto'] = val;
          this.tableData.filter = JSON.stringify(this.filteredValues);
        });

        this.tableData.filterPredicate = this.customFilterPredicate();

        this.loading.next(false);
      });
  }

  customFilterPredicate() {
    const myFilterPredicate = (
      data: budgetsExcelColumns,
      filter: string
    ): boolean => {
      let searchString = JSON.parse(filter);
      return (
        this.checkIfNull(data.taller)
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.taller.toLowerCase()) !== -1 &&
        this.checkIfNull(data.woMain)
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.woMain.toLowerCase()) !== -1 &&
        this.checkIfNull(data.woChild)
          .trim()
          .toLowerCase()
          .indexOf(searchString.woChild.toLowerCase()) !== -1 &&
        this.checkIfNull(data.cliente)
          .trim()
          .toLowerCase()
          .indexOf(searchString.cliente.toLowerCase()) !== -1 &&
        this.checkIfNull(data.statusPresupuesto)
          .trim()
          .toLowerCase()
          .indexOf(searchString.statusPresupuesto.toLowerCase()) !== -1
      );
    };
    return myFilterPredicate;
  }

  public checkIfNull(s: number | string | null): string {
    if (s == null) {
      return '';
    } else {
      return s.toString();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
