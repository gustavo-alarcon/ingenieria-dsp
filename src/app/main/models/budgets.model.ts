import { User } from './user-model';


export interface Budget {
  taller: string;
  woMain: number;
  ioMain: number;
  woChild: number;
  ioChild: number;
  statusWoChild: string;
  otTaller: string;
  otMadre: string;
  fechaAperturaChild: Date;
  fechaReleasedIoChild: Date;
  cliente: string;
  gmorngm: string;
  modelo: string;
  tipoSS: string;
  servicio: string;
  tipoAtencion: string;
  modalidadPresupuesto: string;
  componente: string;
  afa: string;
  fechaUltimoListado: Date;
  fechaUltimoEnvioDocumentoADM: Date;
  ultimoDocumento: string;
  fechaDefinicionDeCargos: Date;
  definicionDeCargo: string;
  fechaUltimoEnvioPPTO: Date;
  fechaEnvioPPTO01: Date;
  fechaEnvioPPTO02: Date;
  // motivoDeModificacion: Array<ModificationReasonEntry>;
  motivoDeModificacion02: ModificationReasonEntry;
  detalleDeModificacion02: string;
  fechaEnvioPPTO03: Date;
  motivoDeModificacion03: ModificationReasonEntry;
  detalleDeModificacion03: string;
  fechaEnvioPPTO04: Date;
  motivoDeModificacion04: ModificationReasonEntry;
  detalleDeModificacion04: string;
  // Check "statusPresupuesto" to know if it is approved or rejected
  fechaDeAprobacionORechazo: AproveEntry;
  // Defines the state of the budget
  statusPresupuesto: string;
  motivoDelRechazo: RejectionReasonsEntry;
  detalleDelRechazo: string;
  vv$servicios: number;
  vv$adicionalesServicios: number;
  vv$descuentoServicios: number;
  vv$repuestos: number;
  vv$adicionalesRepuestos: number;
  vv$descuentoRepuestos: number;
  totalvvPPTOUS$: number;
  $componenteNuevo: string | number;
  reparacion60: string;
  horasSTD: number;
  horasReales: number;
  tiempoObjetivoEnvioPPTO: firebase.default.firestore.Timestamp;
  diasRestantesEnvioPPTO: string;
  NoPPTOSModificadosOAdicionales: string | number;
  observacionesEnElPresupuesto: string;
  fechaDeTerminoDeRep: Date;
  fechaUltimoInput: Date;
  motivoDeInput: string;
  fechaDeFactDeTaller: Date;
  costo$ServiciosCliente: number;
  costo$ServiciosDeOperacion: number;
  rentabilidadServiciosPercent: string;
  costo$RepuestosCLIENTE: number;
  costo$RepuestosOperacion: number;
  rentabilidadRepuestosPercent: string;
  observacionesTaller: string;
  realDevueltoAServicios: number;
  diferenciaServicios: number;
  realDevueltoARepuestos: number;
  diferenciaRepuestos: number;
  totalVVFacturadoUS$: number;
  mesFactVenta: Date;
  percentHorasSTDvsHorasDBS: string;
  fechaFirstLabour: Date;
  fechaLastLabour: Date | firebase.default.firestore.Timestamp;
  diasDemoraFact: number;
  diasFactLastLabour: number;
  elaborarPPTO: string;
  tipoDeComponente: string;
  tipoAAorPandP: string;
  taller02: string;
  diasDesdeAperturaChild: number;
  resumen: string | Date;
  definicionDeCargos: string;
  informe: string | Date;
  cotizacionFesa: string | Date;
  cotizacionText: string | Date;
  statusFacturacion: string;
  excelid: string;
  clave: string;
  obj: number;
  diasPPTO: number;
  mesTer: number;
  anio: number;
  fechaLPD: Date;
  id?: any;
  afaObs?: string;
  fesaObs?: string;
  reportObs?: string;
  summaryObs?: string;
  textObs?: string;
  additionals?: object[];
  afaDate?: string;
}

export interface Additional {
  type: string;
  observation: string;
}

export interface RejectionReasonsEntry {
  id: string;
  name: string;
  detail?:string;
  createdBy: User;
  createdAt: Date;
}

export interface AproveEntry {
  id: string;
  name: string;
  createdBy: User;
  createdAt: Date;
}

export interface ModificationReasonEntry {
  id: string;
  name: string;
  createdBy: User;
  additionals?: Array<Additional>;
  createdAt: Date;
}

export interface modificationReasonForm {
  additionals: Array<Additional>;
  modificationReason: ModificationReasonEntry;
}


export interface rejectionReasonForm {
  rejectionReason:RejectionReasonsEntry;
  detailReason:string;
}
export interface BudgetsBroadcastList {
  id?: string;
  name: string;
  emailList: Array<string>;
  createdAt: firebase.default.firestore.FieldValue;
  createdBy: User;
}

export interface BudgetHistoryDate {
  description?: string;
  type: string;
  date: string;
  createBy: User;
}
