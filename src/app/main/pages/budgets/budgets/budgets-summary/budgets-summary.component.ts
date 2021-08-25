import { BudgetsSummarySendDialogComponent } from './dialogs/budgets-summary-send-dialog/budgets-summary-send-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BudgetsSummaryDeleteDialogComponent } from './dialogs/budgets-summary-delete-dialog/budgets-summary-delete-dialog.component';
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
import moment from 'moment';
import { BudgetsPendingHistoryComponent } from '../budgets-pending-approval/dialogs/budgets-pending-history/budgets-pending-history.component';

import * as FileSaver from 'file-saver';
const EXCEL_EXT = '.xlsx';


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
    private _budgetsService: BudgetsService,
    public MatDialog: MatDialog,
    public MatSnackBar: MatSnackBar,
    
  ) {}

  // Form controllers
  public tallerFormControl: FormControl = new FormControl();
  public woMainFormControl: FormControl = new FormControl();
  public woChildFormControl: FormControl = new FormControl();
  public clienteFormControl: FormControl = new FormControl();
  public statusFormControl: FormControl = new FormControl();

  public tableData: MatTableDataSource<Budget> =
    new MatTableDataSource<Budget>();

  public displayedColumns = [
    'taller',
    'woMain',
    // 'ioMain',
    'woChild',
    // 'ioChild',
    // 'statusWoChild',
    // 'otTaller',
    // 'otMadre',
    'cliente',
    // 'gmorngm',
    'modelo',
    // 'tipoSS',
    // 'servicio',
    // 'tipoAtencion',
    // 'modalidadPresupuesto',
    'componente',
    'fechaAperturaChild',
    'fechaReleasedIoChild',
    'createdAt',
    // 'afa',
    // 'fechaUltimoListado',
    // 'fechaUltimoEnvioDocumentoADM',
    // 'ultimoDocumento',
    // 'fechaDefinicionDeCargos',
    // 'definicionDeCargo',
    'fechaEnvioPPTO01',
    'fechaUltimoEnvioPPTO',
    'NoPPTOSModificadosOAdicionales',
    // 'fechaEnvioPPTO02',
    // 'motivoDeModificacion02',
    // 'detalleDeModificacion02',
    // // 'fechaEnvioPPTO03',
    // 'motivoDeModificacion03',
    // 'detalleDeModificacion03',
    // 'fechaEnvioPPTO04',
    // 'motivoDeModificacion04',
    // 'detalleDeModificacion04',
    'fechaDeAprobacionORechazo',
    'statusPresupuesto',
    'motivoDelRechazo',
    // 'detalleDelRechazo',
    // 'vv$servicios',
    // 'vv$adicionalesServicios',
    // 'vv$descuentoServicios',
    // 'vv$repuestos',
    // 'vv$adicionalesRepuestos',
    // 'vv$descuentoRepuestos',
    // 'totalvvPPTOUS$',
    // '$componenteNuevo',
    // 'reparacion60',
    // 'horasSTD',
    // 'horasReales',
    // 'tiempoObjetivoEnvioPPTO',
    // 'diasRestantesEnvioPPTO',
    // 'observacionesEnElPresupuesto',
    // 'fechaDeTerminoDeRep',
    // 'fechaUltimoInput',
    // 'motivoDeInput',
    // 'fechaDeFactDeTaller',
    // 'costo$ServiciosCliente',
    // 'costo$ServiciosDeOperacion',
    // 'rentabilidadServiciosPercent',
    // 'costo$RepuestosCLIENTE',
    // 'costo$RepuestosOperacion',
    // 'rentabilidadRepuestosPercent',
    // 'observacionesTaller',
    // 'realDevueltoAServicios',
    // 'diferenciaServicios',
    // 'realDevueltoARepuestos',
    // 'diferenciaRepuestos',
    // 'totalVVFacturadoUS$',
    // 'mesFactVenta',
    // 'percentHorasSTDvsHorasDBS',
    // 'fechaFirstLabour',
    // 'fechaLastLabour',
    // 'diasDemoraFact',
    // 'diasFactLastLabour',
    // 'elaborarPPTO',
    // 'tipoDeComponente',
    // 'tipoAAorPandP',
    // 'taller02',
    // 'diasDesdeAperturaChild',
    // 'resumen',
    // 'definicionDeCargos',
    // 'informe',
    // 'cotizacionFesa',
    // 'cotizacionText',
    // 'excelid',
    // 'clave',
    // 'obj',
    // 'diasPPTO',
    // 'mesTer',
    // 'anio',
    // 'fechaLPD',
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
    console.log(this.ngAfterViewInit)
  }

  
   



  public ngAfterViewInit(): void {
    const tableFilter: any[] = [];
    this.tableData.sort = this.sort;
    this.tableData.paginator = this.paginator;
    this._budgetsService
      .getBudgets()
      .pipe()
      .subscribe((res) => {
        this.tableData.data = res;
        this.cantWO = this.tableData.data.length;
       

        this.tallerFormControl.valueChanges.subscribe((val) => {
          console.log('val',val);
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
    const myFilterPredicate = (data: Budget, filter: string): boolean => {
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



  public downloadReport(json: any[], excelFileName: string): void {
    const dataSource: Array<Budget> = this.tableData.filteredData;

    const tableXlsx: any[] = [];
    const headersXlsx = [
      'TALLER',
      'WO MAIN',
      'WO CHILD',
      'CLIENTE',
      'MODELO',
      'COMPONENTE',
      'FECHA APERTURA CHILD',
      'FECHA RELEASED IO CHILD',
      'FECHA REGISTRO',
      'FECHA ENVIO PPTO 01',
      'FECHA ULTIMO ENVIO PPTO',
      'NO. PPTOS MODIFICADOS O ADICIONALES',
      'FECHA DE APROBACIÓN O RECHAZO',
      'STATUS PRESUPUESTO',
      'MOTIVO DEL RECHAZO',
      
      'IO CHILD',
      'STATUS WO CHILD',
      'OT TALLER',
      'OT MADRE',
      'GM / NGM',
      'TIPO SS',
      'SERVICIO',
      'TIPO ATENCIÓN',
      'MODALIDAD PRESUPUESTO',
      'AFA',
      'FECHA ULTIMO LISTADO',
      'FECHA ULTIMO ENVIO DOCUMENTO ADM',
      'ULTIMO DOCUMENTO',
      'FECHA DEFINICIÓN CARGOS',
      'DEFINICIÓN DE CARGO',
      'FECHA ENVIO PPTO 02',
      'MOTIVO DE MODIFICACIÓN 02',
      'DETALLE DE MODIFICACIÓN 02',
      'FECHA ENVIO PPTO 03',
      'MOTIVO DE MODIFICACION 03',
      'DETALLE DE MODIFICACION 03',
      'FECHA ENVIO PPTO 04',
      'MOTIVO DE MODIFICACIÓN 04',
      'DETALLE DE MODIFICACIÓN 04',
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
      'IO MAIN',
    ];

    tableXlsx.push(headersXlsx);

    dataSource.forEach((item) => {
      const temp = [
        item.taller ? item.taller : '---',
        item.woMain ? item.woMain : '---',
        item.woChild ? item.woChild : '---',
        item.cliente ? item.cliente : '---',
        item.modelo ? item.modelo : '---',
        item.componente ? item.componente : '---',
        item.fechaAperturaChild
        ? new Date(item.fechaAperturaChild['seconds'] * 1000)
        : '---',
        item.fechaReleasedIoChild
        ? new Date(item.fechaReleasedIoChild['seconds'] * 1000)
        : '---',
        '---',
        item.fechaEnvioPPTO01
        ? new Date(item.fechaEnvioPPTO01['seconds'] * 1000)
        : '---',
        item.fechaUltimoEnvioPPTO
        ? new Date(item.fechaUltimoEnvioPPTO['seconds'] * 1000)
        : '---',
        item.NoPPTOSModificadosOAdicionales
        ? item.NoPPTOSModificadosOAdicionales
        : '---',
        item.fechaDeAprobacionORechazo
          ? new Date(item.fechaDeAprobacionORechazo['seconds'] * 1000)
          : '---',
        item.statusPresupuesto ? item.statusPresupuesto : '---',
        item.motivoDelRechazo ? item.motivoDelRechazo : '---',
        item.ioChild ? item.ioChild : '---',
        item.statusWoChild ? item.statusWoChild:'---',
        item.otTaller ? item.otTaller : '---',
        item.otMadre ? item.otMadre : '---',
        item.gmorngm ? item.gmorngm : '---',
        item.tipoSS ? item.tipoSS : '---',
        item.servicio ? item.servicio : '---',
        item.tipoAtencion ? item.tipoAtencion : '---',
        item.modalidadPresupuesto ? item.modalidadPresupuesto : '---',
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
        this.daysLeft(item),
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
           item.ioMain ? item.ioMain : '---',
      ];
      tableXlsx.push(temp);
    });

       // generate worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableXlsx);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tabla_Resumen');

    const name = `Tabla_Resumen.xlsx`;
    XLSX.writeFile(wb, name);
  

  }


  public deleteDialog(element: Budget) {
    const dialogRef = this.MatDialog.open(BudgetsSummaryDeleteDialogComponent, {
      data: {
        woMain: element.woMain,
        woChild: element.woChild,
      },
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then((res) => {
        if (res == 'delete') {
          this.loading.next(true);
          this._budgetsService.deleteBudget(element.id).subscribe(
            () => {
              this.MatSnackBar.open('✅ Eliminado correctamente!', 'Aceptar', {
                duration: 6000,
              });
              this.refresh();
              this.loading.next(false);
            },
            (error) => {
              this.MatSnackBar.open('🚨 Ha ocurrido un error! ', 'Aceptar', {
                duration: 6000,
              });
              this.loading.next(false);
            }
          );
        }
      });
  }

  // Function to refresh the mat-table data source
  refresh(): void {
    this.tableData.data = this.tableData.data;
  }

  public sendDialog(element: Budget) {
    this.MatDialog.open(BudgetsSummarySendDialogComponent, {
      disableClose: true,
      data: element
    });
  }

  public timelineDialog(element: Budget) {
    const a = this.MatDialog.open(BudgetsPendingHistoryComponent, {
      width: '90vw',
      maxWidth: '700px',
      data: element,
    });
  }

  daysLeft(budget: Budget) {
        // Get the goal Date and convert it to a moment.js object

        if(typeof budget.tiempoObjetivoEnvioPPTO === 'number'){
          // convertir fechaApert. en milisegundos
         
          const openDate = budget.fechaAperturaChild['seconds'] * 1000;
          
          // convertir los dias del tiempoOb. en mili segundos
          const timeDate = budget.tiempoObjetivoEnvioPPTO * 8.64e+7;
        
  
         const goalDate = openDate + timeDate;
  
  
         const leftDate = goalDate -  Date.now();
  
         const date = (leftDate / 8.64e+7).toFixed(2);
  
         return date;
  
      }else{
      
      
    
      const goalDate: moment.Moment = moment(
        budget.tiempoObjetivoEnvioPPTO.toDate()
      ) 
  
      
  
  
      // Get the difference from the current moment() in days
      const diff: number = goalDate.diff(moment(), 'days');
  
  
      if (diff >= 0) return diff.toString();
      

    
  
      return diff ;
      }
    // // Get the goal Date and convert it to a moment.js object

    // if(typeof budget.tiempoObjetivoEnvioPPTO === 'number'){
    //     // convertir fechaApert. en milisegundos
       
    //     const openDate = budget.fechaAperturaChild['seconds'] * 1000;
        
    //     // convertir los dias del tiempoOb. en mili segundos
    //     const timeDate = budget.tiempoObjetivoEnvioPPTO * 8.64e+7;
      

    //    const goalDate = openDate + timeDate;


    //    const leftDate = goalDate -  Date.now();

    //    const date = (leftDate / 8.64e+7).toFixed(2);

    //    return date;

    // }else{
    
    
  
    // const goalDate: moment.Moment = moment(
    //   budget.tiempoObjetivoEnvioPPTO.toDate()
    // ) 

    


    // // Get the difference from the current moment() in days
    // const diff: number = goalDate.diff(moment(), 'days');


    // if (diff >= 0) return diff.toString();

    // return '---';
    // }
    
  }
}
