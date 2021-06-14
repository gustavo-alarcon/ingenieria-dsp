import { PendingSendUpdateDialogComponent } from './dialogs/pending-send-update-dialog/pending-send-update-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Budget } from './../../../../models/budgets.model';
import { BudgetsService } from './../../../../services/budgets.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-budgets-pending-send',
  templateUrl: './budgets-pending-send.component.html',
  styleUrls: ['./budgets-pending-send.component.scss'],
})
export class BudgetsPendingSendComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public auth: AuthService,
    private breakpoint: BreakpointObserver,
    private _budgetsService: BudgetsService,
    public MatDialog: MatDialog,
    public MatSnackBar: MatSnackBar
  ) {}

  // Form controllers
  public woMainFormControl: FormControl = new FormControl();
  public woChildFormControl: FormControl = new FormControl();
  public clienteFormControl: FormControl = new FormControl();

  public tableData: MatTableDataSource<Budget> =
    new MatTableDataSource<Budget>();

  public displayedColumns = [
    'woMain',
    'woChild',
    'cliente',
    'afa',
    'resumen',
    'cotizacionFesa',
    'cotizacionText',
    'informe',
    'tiempoObjetivoEnvioPPTO',
    'diasRestantesEnvioPPTO',
    'fechaReleasedIoChild',
    'actions',
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
      .getBudgetsPendingSend()
      .pipe()
      .subscribe((res) => {
        this.tableData.data = res;
        this.cantWO = this.tableData.data.length;

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

        this.tableData.filterPredicate = this.customFilterPredicate();

        this.loading.next(false);
      });
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: Budget, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      return (
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
          .indexOf(searchString.cliente.toLowerCase()) !== -1
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

  public downloadReport(): void {
    const dataSource: Array<Budget> = this.tableData.data;

    const tableXlsx: any[] = [];
    const headersXlsx = [
      'TALLER',
      'WO MAIN',
      'IO MAIN',
      'WO CHILD',
      'IO CHILD',
      'STATUS WO CHILD',
      'OT TALLER',
      'OT MADRE',
      'FECHA APERTURA CHILD',
      'FECHA RELEASED IO CHILD',
      'CLIENTE',
      'GM / NGM',
      'MODELO',
      'TIPO SS',
      'SERVICIO',
      'TIPO ATENCIÓN',
      'MODALIDAD PRESUPUESTO',
      'COMPONENTE',
      'AFA',
      'FECHA ULTIMO LISTADO',
      'FECHA ULTIMO ENVIO DOCUMENTO ADM',
      'ULTIMO DOCUMENTO',
      'FECHA DEFINICIÓN CARGOS',
      'DEFINICIÓN DE CARGO',
      'FECHA ULTIMO ENVIO PPTO',
      'FECHA ENVIO PPTO 01',
      'FECHA ENVIO PPTO 02',
      'MOTIVO DE MODIFICACIÓN 02',
      'DETALLE DE MODIFICACIÓN 02',
      'FECHA ENVIO PPTO 03',
      'MOTIVO DE MODIFICACION 03',
      'DETALLE DE MODIFICACION 03',
      'FECHA ENVIO PPTO 04',
      'MOTIVO DE MODIFICACIÓN 04',
      'DETALLE DE MODIFICACIÓN 04',
      'FECHA DE APROBACIÓN O RECHAZO',
      'STATUS PRESUPUESTO',
      'MOTIVO DEL RECHAZO',
      'DETALLE DEL RECHAZO',
      'VV$ SERVICIOS',
      'VV$ ADICIONALES SERVICIOS',
      'VV$ DESCUENTOS SERVICIOS',
      'VV$ REPUESTOS',
      'VV$ ADICIONALES REPUESTOS',
      'VV$ DESCUENTO REPUESTOS',
      'TOTAL VV PPTO US$',
      '$ COMPONENTE NUEVO',
      'REPARACIÓN 60%',
      'HORAS STD',
      'HORAS REALES',
      'TIEMPO OBJETIVO ENVIO PPTO',
      'DIAS RESTANTES ENVIO PPTO',
      'NO. PPTOS MODIFICADOS O ADICIONALES',
      'OBSERVACIONES EN EL PRESUPUESTO',
      'FECHA DE TERMINO DE REP',
      'FECHA ULTIMO INPUT',
      'MOTIVO DE INPUT',
      'FECHA DE FACT. DE TALLER',
      'COSTO $ SERVICIOS CLIENTE',
      'COSTO $ SERVICIOS DE OPERACIÓN',
      'RENTABILIDAD SERVICIOS %',
      'COSTO $ REPUESTOS CLIENTE',
      'COSTO $ REPUESTOS OPERACIÓN',
      'RENTABILIDAD REPUESTOS %',
      'OBSERVACIONES TALLER',
      'REAL DEVUELTO A SERVICIOS',
      'DIFERENCIA SERVICIOS',
      'REAL DEVUELTO A REPUESTOS',
      'DIFERENCIA REPUESTOS',
      'TOTAL VV FACTURADO US$',
      'MES FACT. VENTA',
      '% HORAS STD VS HORAS DBS',
      'FECHA FIRST LABOUR',
      'FECHA LAST LABOUR',
      'DIAS DEMORA FACT',
      'DIAS FACT LAST LABOUR',
      'ELABORAR PPTO',
      'TIPO DE COMPONENTE',
      'TIPO (AA // P&P)',
      'TALLER 02',
      'DIAS DESDE APERTURA CHILD',
      'RESUMEN',
      'DEFINICÍON DE CARGOS',
      'INFORME',
      'COTIZACIÓN FESA',
      'COTIZACIÓN TEXT',
      'ID',
      'CLAVE',
      'OBJ',
      'DIAS PPTO',
      'MES TER',
      'AÑO',
      'FECHA LPD',
    ];

    tableXlsx.push(headersXlsx);

    dataSource.forEach((item) => {
      const temp = [
        item.taller ? item.taller : '---',
        item.woMain ? item.woMain : '---',
        item.ioMain ? item.ioMain : '---',
        item.woChild ? item.woChild : '---',
        item.ioChild ? item.ioChild : '---',
        item.statusWoChild ? item.statusWoChild : '---',
        item.otTaller ? item.otTaller : '---',
        item.otMadre ? item.otMadre : '---',
        item.fechaAperturaChild
          ? new Date(item.fechaAperturaChild['seconds'] * 1000)
          : '---',
        item.fechaReleasedIoChild
          ? new Date(item.fechaReleasedIoChild['seconds'] * 1000)
          : '---',
        item.cliente ? item.cliente : '---',
        item.gmorngm ? item.gmorngm : '---',
        item.modelo ? item.modelo : '---',
        item.tipoSS ? item.tipoSS : '---',
        item.servicio ? item.servicio : '---',
        item.tipoAtencion ? item.tipoAtencion : '---',
        item.modalidadPresupuesto ? item.modalidadPresupuesto : '---',
        item.componente ? item.componente : '---',
        item.afa ? item.afa : '---',
        item.fechaUltimoListado
          ? new Date(item.fechaUltimoListado['seconds'] * 1000)
          : '---',
        item.fechaUltimoEnvioDocumentoADM
          ? new Date(item.fechaUltimoEnvioDocumentoADM['seconds'] * 1000)
          : '---',
        item.ultimoDocumento ? item.ultimoDocumento : '---',
        item.fechaDefinicionDeCargos
          ? new Date(item.fechaDefinicionDeCargos['seconds'] * 1000)
          : '---',
        item.definicionDeCargo ? item.definicionDeCargo : '---',
        item.fechaUltimoEnvioPPTO
          ? new Date(item.fechaUltimoEnvioPPTO['seconds'] * 1000)
          : '---',
        item.fechaEnvioPPTO01
          ? new Date(item.fechaEnvioPPTO01['seconds'] * 1000)
          : '---',
        item.fechaEnvioPPTO02
          ? new Date(item.fechaEnvioPPTO02['seconds'] * 1000)
          : '---',
        item.motivoDeModificacion02 ? item.motivoDeModificacion02 : '---',
        item.detalleDeModificacion02 ? item.detalleDeModificacion02 : '---',
        item.fechaEnvioPPTO03
          ? new Date(item.fechaEnvioPPTO03['seconds'] * 1000)
          : '---',
        item.motivoDeModificacion03 ? item.motivoDeModificacion03 : '---',
        item.detalleDeModificacion03 ? item.detalleDeModificacion03 : '---',
        item.fechaEnvioPPTO04
          ? new Date(item.fechaEnvioPPTO04['seconds'] * 1000)
          : '---',
        item.motivoDeModificacion04 ? item.motivoDeModificacion04 : '---',
        item.detalleDeModificacion04 ? item.detalleDeModificacion04 : '---',
        item.fechaDeAprobacionORechazo
          ? new Date(item.fechaDeAprobacionORechazo['seconds'] * 1000)
          : '---',
        item.statusPresupuesto ? item.statusPresupuesto : '---',
        item.motivoDelRechazo ? item.motivoDelRechazo : '---',
        item.detalleDelRechazo ? item.detalleDelRechazo : '---',
        item.vv$servicios ? item.vv$servicios : '---',
        item.vv$adicionalesServicios ? item.vv$adicionalesServicios : '---',
        item.vv$descuentoServicios ? item.vv$descuentoServicios : '---',
        item.vv$repuestos ? item.vv$repuestos : '---',
        item.vv$adicionalesRepuestos ? item.vv$adicionalesRepuestos : '---',
        item.vv$descuentoRepuestos ? item.vv$descuentoRepuestos : '---',
        item.totalvvPPTOUS$ ? item.totalvvPPTOUS$ : '---',
        item.$componenteNuevo ? item.$componenteNuevo : '---',
        item.reparacion60 ? item.reparacion60 : '---',
        item.horasSTD ? item.horasSTD : '---',
        item.horasReales ? item.horasReales : '---',
        item.tiempoObjetivoEnvioPPTO ? item.tiempoObjetivoEnvioPPTO : '---',
        item.diasRestantesEnvioPPTO ? item.diasRestantesEnvioPPTO : '---',
        item.NoPPTOSModificadosOAdicionales
          ? item.NoPPTOSModificadosOAdicionales
          : '---',
        item.observacionesEnElPresupuesto
          ? item.observacionesEnElPresupuesto
          : '---',
        item.fechaDeTerminoDeRep
          ? new Date(item.fechaDeTerminoDeRep['seconds'] * 1000)
          : '---',
        item.fechaUltimoInput
          ? new Date(item.fechaUltimoInput['seconds'] * 1000)
          : '---',
        item.motivoDeInput ? item.motivoDeInput : '---',
        item.fechaDeFactDeTaller
          ? new Date(item.fechaDeFactDeTaller['seconds'] * 1000)
          : '---',
        item.costo$ServiciosCliente ? item.costo$ServiciosCliente : '---',
        item.costo$ServiciosDeOperacion
          ? item.costo$ServiciosDeOperacion
          : '---',
        item.rentabilidadServiciosPercent
          ? item.rentabilidadServiciosPercent
          : '---',
        item.costo$RepuestosCLIENTE ? item.costo$RepuestosCLIENTE : '---',
        item.costo$RepuestosOperacion ? item.costo$RepuestosOperacion : '---',
        item.rentabilidadRepuestosPercent
          ? item.rentabilidadRepuestosPercent
          : '---',
        item.observacionesTaller ? item.observacionesTaller : '---',
        item.realDevueltoAServicios ? item.realDevueltoAServicios : '---',
        item.diferenciaServicios ? item.diferenciaServicios : '---',
        item.realDevueltoARepuestos ? item.realDevueltoARepuestos : '---',
        item.diferenciaRepuestos ? item.diferenciaRepuestos : '---',
        item.totalVVFacturadoUS$ ? item.totalVVFacturadoUS$ : '---',
        item.mesFactVenta ? item.mesFactVenta : '---',
        item.percentHorasSTDvsHorasDBS ? item.percentHorasSTDvsHorasDBS : '---',
        item.fechaFirstLabour
          ? new Date(item.fechaFirstLabour['seconds'] * 1000)
          : '---',
        item.fechaLastLabour
          ? new Date(item.fechaLastLabour['seconds'] * 1000)
          : '---',
        item.diasDemoraFact ? item.diasDemoraFact : '---',
        item.diasFactLastLabour ? item.diasFactLastLabour : '---',
        item.elaborarPPTO ? item.elaborarPPTO : '---',
        item.tipoDeComponente ? item.tipoDeComponente : '---',
        item.tipoAAorPandP ? item.tipoAAorPandP : '---',
        item.taller02 ? item.taller02 : '---',
        item.diasDesdeAperturaChild ? item.diasDesdeAperturaChild : '---',
        item.resumen ? item.resumen : '---',
        item.definicionDeCargos ? item.definicionDeCargos : '---',
        item.informe ? item.informe : '---',
        item.cotizacionFesa ? item.cotizacionFesa : '---',
        item.cotizacionText ? item.cotizacionText : '---',
        item.excelid ? item.excelid : '---',
        item.clave ? item.clave : '---',
        item.obj ? item.obj : '---',
        item.diasPPTO ? item.diasPPTO : '---',
        item.mesTer ? item.mesTer : '---',
        item.anio ? item.anio : '---',
        item.fechaLPD ? new Date(item.fechaLPD['seconds'] * 1000) : '---',
      ];
      tableXlsx.push(temp);
    });

    // generate worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableXlsx);

    // generate workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tabla_Resumen');

    // save to file
    const name = `Tabla_Resumen.xlsx`;
    XLSX.writeFile(wb, name);
  }

  // Function to refresh the mat-table data source
  refresh(): void {
    this.tableData.data = this.tableData.data;
  }

  public updateDialog(budget: Budget) {
    const ref = this.MatDialog.open(PendingSendUpdateDialogComponent, {
      data: budget,
    });

    ref.afterClosed().subscribe((res) => {});
  }
}
