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
  fechaAperturaChild: Date & firebase.default.firestore.Timestamp;
  fechaReleasedIoChild: Date & firebase.default.firestore.Timestamp;
  cliente: string;
  gmorngm: string;
  modelo: string;
  tipoSS: string;
  servicio: string;
  tipoAtencion: string;
  modalidadPresupuesto: string;
  componente: string;
  afa: string;
  fechaUltimoListado: Date & firebase.default.firestore.Timestamp;
  fechaUltimoEnvioDocumentoADM: Date & firebase.default.firestore.Timestamp;
  ultimoDocumento: string;
  fechaDefinicionDeCargos: Date & firebase.default.firestore.Timestamp;
  definicionDeCargo: string;
  fechaUltimoEnvioPPTO: Date & firebase.default.firestore.Timestamp;
  fechaEnvioPPTO01: Date & firebase.default.firestore.Timestamp;
  fechaEnvioPPTO02: Date & firebase.default.firestore.Timestamp;
  motivoDeModificacion: Array<ModificationReasonEntry>;
  motivoDeModificacion02: ModificationReasonEntry;
  motivoDeModificacionName02:string,
  detalleDeModificacion02: string;
  fechaEnvioPPTO03: Date & firebase.default.firestore.Timestamp;
  motivoDeModificacion03: ModificationReasonEntry;
  motivoDeModificacionName03:string;
  detalleDeModificacion03: string;
  fechaEnvioPPTO04: Date & firebase.default.firestore.Timestamp;
  motivoDeModificacion04: ModificationReasonEntry;
  motivoDeModificacionName04:string,
  detalleDeModificacion04: string;
  // Check "statusPresupuesto" to know if it is approved or rejected
  fechaDeAprobacionORechazo: Date & firebase.default.firestore.Timestamp;
  aprobadoPor?: User,
  rechazadoPor?: User,
  // Defines the state of the budget
  statusPresupuesto: string;
  motivoDelRechazo: string;
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
  tiempoObjetivoEnvioPPTO: Date & firebase.default.firestore.Timestamp;
  diasRestantesEnvioPPTO: string;
  NoPPTOSModificadosOAdicionales: number;
  observacionesEnElPresupuesto: string;
  fechaDeTerminoDeRep: Date & firebase.default.firestore.Timestamp;
  fechaUltimoInput: Date & firebase.default.firestore.Timestamp;
  motivoDeInput: string;
  fechaDeFactDeTaller: Date & firebase.default.firestore.Timestamp;
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
  mesFactVenta: Date & firebase.default.firestore.Timestamp;
  percentHorasSTDvsHorasDBS: string;
  fechaFirstLabour: Date & firebase.default.firestore.Timestamp;
  fechaLastLabour: Date & firebase.default.firestore.Timestamp;
  diasDemoraFact: number;
  diasFactLastLabour: number;
  elaborarPPTO: string;
  tipoDeComponente: string;
  tipoAAorPandP: string;
  taller02: string;
  diasDesdeAperturaChild: number;
  resumen: string | (Date & firebase.default.firestore.Timestamp);
  definicionDeCargos: string;
  informe: string | (Date & firebase.default.firestore.Timestamp);
  cotizacionFesa: string | (Date & firebase.default.firestore.Timestamp);
  cotizacionText: string | (Date & firebase.default.firestore.Timestamp);
  statusFacturacion: string;
  excelid: string;
  clave: string;
  obj: number;
  diasPPTO: number;
  mesTer: number;
  anio: number;
  fechaLPD: Date & firebase.default.firestore.Timestamp;
  id?: any;
  afaObs?: string;
  fesaObs?: string;
  reportObs?: string;
  summaryObs?: string;
  textObs?: string;
  additionals?: object[];
  afaDate?: string;
  versionCount?: number;
  documentVersions?: {
    version: number,
    budgets: Array<string>,
    reports: Array<string>,
    quotations: Array<string>
  } []
}

export interface documentVersion {
  version: number,
  budgets: Array<any>,
  reports: Array<string>,
  quotations: Array<string>
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


export interface ApprovedEntry {
  createdBy: User;
  createdAt: firebase.default.firestore.FieldValue;
}

export interface ModificationReasonEntry {
  id: string;
  name: string;
  createdBy: User;
  additionals: Array<Additional>;
  createdAt: firebase.default.firestore.FieldValue;
}

export interface additionalsForms {
  additionals:Array<Additional>
}

export interface modificationReasonForm {
  additionals: Array<Additional>;
  modificationReason: ModificationReasonEntry;
  detailModify: string,
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
  milli: number;
  createBy: User;
}
