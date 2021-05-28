import { User } from './user-model';
import * as firebase from 'firebase/app';

export interface budgetsExcelColumns {
  taller: string;
  woMain: string;
  ioMain: string;
  woChild: string;
  ioChild: string;
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
  motivoDeModificacion02: string;
  detalleDeModificacion02: string;
  fechaEnvioPPTO03: Date;
  motivoDeModificacion03: string;
  detalleDeModificacion03: string;
  fechaEnvioPPTO04: Date;
  motivoDeModificacion04: string;
  detalleDeModificacion04: string;
  fechaDeAprobacionORechazo: Date;
  statusPresupuesto: string;
  motivoDelRechazo: string;
  detalleDelRechazo: string;
  vv$servicios: string;
  vv$adicionalesServicios: string;
  vv$descuentoServicios: string;
  vv$repuestos: string;
  vv$adicionalesRepuestos: string;
  vv$descuentoRepuestos: string;
  totalvvPPTOUS$: string;
  $componenteNuevo: string;
  reparacion60: string;
  horasSTD: string;
  horasReales: string;
  tiempoObjetivoEnvioPPTO: string;
  diasRestantesEnvioPPTO: string;
  NoPPTOSModificadosOAdicionales: string;
  observacionesEnElPresupuesto: string;
  fechaDeTerminoDeRep: Date;
  fechaUltimoInput: Date;
  motivoDeInput: string;
  fechaDeFactDeTaller: Date;
  costo$ServiciosCliente: string;
  costo$ServiciosDeOperacion: string;
  rentabilidadServiciosPercent: string;
  costo$RepuestosCLIENTE: string;
  costo$RepuestosOperacion: string;
  rentabilidadRepuestosPercent: string;
  observacionesTaller: string;
  realDevueltoAServicios: string;
  diferenciaServicios: string;
  realDevueltoARepuestos: string;
  diferenciaRepuestos: string;
  totalVVFacturadoUS$: string;
  mesFactVenta: Date;
  percentHorasSTDvsHorasDBS: string;
  fechaFirstLabour: Date;
  fechaLastLabour: Date;
  diasDemoraFact: string;
  diasFactLastLabour: string;
  elaborarPPTO: string;
  tipoDeComponente: string;
  tipoAAorPandP: string;
  taller02: string;
  diasDesdeAperturaChild: string;
  resumen: string;
  definicionDeCargos: string;
  informe: string;
  cotizacionFesa: string;
  cotizacionText: string;
  excelid: string;
  clave: string;
  obj: string;
  diasPPTO: string;
  mesTer: string;
  anio: string;
  fechaLPD: Date;
  id?: any;
}

export interface rejectionReasonsEntry {
  id: string;
  name: string;
  createdBy: User;
  createdAt: firebase.default.firestore.FieldValue;
}

export interface modificationReasonEntry {
  id: string;
  name: string;
  createdBy: User;
  createdAt: firebase.default.firestore.FieldValue;
}

export interface BudgetsBroadcastList {
  id?: string;
  name: string;
  emailList: Array<string>;
  createdAt: firebase.default.firestore.FieldValue;
  createdBy: User;
}
