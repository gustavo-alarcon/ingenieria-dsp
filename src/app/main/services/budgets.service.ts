import { map, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import {
  RejectionReasonsEntry,
  ModificationReasonEntry,
  BudgetsBroadcastList,
  modificationReasonForm,
  rejectionReasonForm,
  BudgetHistoryDate,
  Budget,
  ApprovedEntry,
} from '../models/budgets.model';

import { User } from '../models/user-model';
import { Observable, of } from 'rxjs';

import * as firebase from 'firebase/app';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { element } from 'protractor';
import { TestBed } from '@angular/core/testing';
import { B } from '@angular/cdk/keycodes';
import { additionalsForms } from '../models/budgets.model';



@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  constructor(private afs: AngularFirestore) {}

  checkBudgetConflicts(entry: Budget): Observable<{
    isDuplicated: boolean;
    canUpgrade: boolean;
    fields: {};
  }> {
    const budgetsRef = this.afs
      .collection<Budget>(`db/ferreyros/budgets`, (ref) =>
        ref
          .where('woMain', '==', entry.woMain)
          .where('woChild', '==', entry.woChild)
      )
      .valueChanges();

    return budgetsRef.pipe(
      map((res) => {
        let isDuplicated = false;
        let canUpgrade = false;
        let fields: Partial<Budget> = {};

        if (res.length) {
          // Duplicated entry
          isDuplicated = true;

          // Now check for different fields
          fields = this.checkBudgetUpgrades(entry, res[0]);

          if (Object.entries(fields).length) canUpgrade = true;
        }

        return {
          isDuplicated: isDuplicated,
          canUpgrade: canUpgrade,
          budgetId: res[0] ? res[0].id : null,
          fields: fields,
          applyUpgrade: false,
        };
      })
    );
  }

  checkBudgetUpgrades(
    newBudget: Budget,
    actualBudget: Budget
  ): Partial<Budget> {
    let budgetDifferences: Partial<Budget> = {};
    let budgetUpgrade: Partial<Budget> = {};

    if (newBudget.taller !== actualBudget.taller) {
      budgetDifferences.taller = actualBudget.taller;
    }

    if (newBudget.woMain !== actualBudget.woMain) {
      budgetDifferences.woMain = actualBudget.woMain;
    }

    if (newBudget.ioMain !== actualBudget.ioMain) {
      budgetDifferences.ioMain = actualBudget.ioMain;
    }

    if (newBudget.woChild !== actualBudget.woChild) {
      budgetDifferences.woChild = actualBudget.woChild;
    }

    if (newBudget.statusWoChild !== actualBudget.statusWoChild) {
      budgetDifferences.statusWoChild = actualBudget.statusWoChild;
    }

    if (newBudget.otTaller !== actualBudget.otTaller) {
      budgetDifferences.otTaller = actualBudget.otTaller;
    }

    if (newBudget.otMadre !== actualBudget.otMadre) {
      budgetDifferences.otMadre = actualBudget.otMadre;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaAperturaChild) >
      this.parseTimestampIntegrity(actualBudget.fechaAperturaChild)
    ) {
      budgetDifferences.fechaAperturaChild = actualBudget.fechaAperturaChild;
    }

    // FROM HERE

    if (newBudget.cliente !== actualBudget.cliente) {
      budgetDifferences.cliente = actualBudget.cliente;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaReleasedIoChild) >
      this.parseTimestampIntegrity(actualBudget.fechaReleasedIoChild)
    ) {
      budgetDifferences.fechaReleasedIoChild =
        actualBudget.fechaReleasedIoChild;
    }

    if (newBudget.gmorngm !== actualBudget.gmorngm) {
      budgetDifferences.gmorngm = actualBudget.gmorngm;
    }

    if (newBudget.modelo !== actualBudget.modelo) {
      budgetDifferences.modelo = actualBudget.modelo;
    }

    if (newBudget.tipoSS !== actualBudget.tipoSS) {
      budgetDifferences.tipoSS = actualBudget.tipoSS;
    }

    if (newBudget.servicio !== actualBudget.servicio) {
      budgetDifferences.servicio = actualBudget.servicio;
    }

    if (newBudget.tipoAtencion !== actualBudget.tipoAtencion) {
      budgetDifferences.tipoAtencion = actualBudget.tipoAtencion;
    }

    if (newBudget.modalidadPresupuesto !== actualBudget.modalidadPresupuesto) {
      budgetDifferences.modalidadPresupuesto =
        actualBudget.modalidadPresupuesto;
    }

    if (newBudget.componente !== actualBudget.componente) {
      budgetDifferences.componente = actualBudget.componente;
    }

    if (newBudget.afa !== actualBudget.afa) {
      budgetDifferences.afa = actualBudget.afa;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaUltimoListado) >
      this.parseTimestampIntegrity(actualBudget.fechaUltimoListado)
    ) {
      budgetDifferences.fechaUltimoListado = actualBudget.fechaUltimoListado;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaUltimoEnvioDocumentoADM) >
      this.parseTimestampIntegrity(actualBudget.fechaUltimoEnvioDocumentoADM)
    ) {
      budgetDifferences.fechaUltimoEnvioDocumentoADM =
        actualBudget.fechaUltimoEnvioDocumentoADM;
    }

    if (newBudget.ultimoDocumento !== actualBudget.ultimoDocumento) {
      budgetDifferences.ultimoDocumento = actualBudget.ultimoDocumento;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaDefinicionDeCargos) >
      this.parseTimestampIntegrity(actualBudget.fechaDefinicionDeCargos)
    ) {
      budgetDifferences.fechaDefinicionDeCargos =
        actualBudget.fechaDefinicionDeCargos;
    }

    if (newBudget.definicionDeCargo !== actualBudget.definicionDeCargo) {
      budgetDifferences.definicionDeCargo = actualBudget.definicionDeCargo;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaUltimoEnvioPPTO) >
      this.parseTimestampIntegrity(actualBudget.fechaUltimoEnvioPPTO)
    ) {
      budgetDifferences.fechaUltimoEnvioPPTO =
        actualBudget.fechaUltimoEnvioPPTO;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaEnvioPPTO01) >
      this.parseTimestampIntegrity(actualBudget.fechaEnvioPPTO01)
    ) {
      budgetDifferences.fechaEnvioPPTO01 = actualBudget.fechaEnvioPPTO01;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaEnvioPPTO02) >
      this.parseTimestampIntegrity(actualBudget.fechaEnvioPPTO02)
    ) {
      budgetDifferences.fechaEnvioPPTO02 = actualBudget.fechaEnvioPPTO02;
    }

    if (
      newBudget.motivoDeModificacion02 !== actualBudget.motivoDeModificacion02
    ) {
      budgetDifferences.motivoDeModificacion02 =
        actualBudget.motivoDeModificacion02;
    }

    if (
      newBudget.detalleDeModificacion02 !== actualBudget.detalleDeModificacion02
    ) {
      budgetDifferences.detalleDeModificacion02 =
        actualBudget.detalleDeModificacion02;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaEnvioPPTO03) >
      this.parseTimestampIntegrity(actualBudget.fechaEnvioPPTO03)
    ) {
      budgetDifferences.fechaEnvioPPTO03 = actualBudget.fechaEnvioPPTO03;
    }

    if (
      newBudget.motivoDeModificacion03 !== actualBudget.motivoDeModificacion03
    ) {
      budgetDifferences.motivoDeModificacion03 =
        actualBudget.motivoDeModificacion03;
    }

    if (
      newBudget.detalleDeModificacion03 !== actualBudget.detalleDeModificacion03
    ) {
      budgetDifferences.detalleDeModificacion03 =
        actualBudget.detalleDeModificacion03;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaEnvioPPTO04) >
      this.parseTimestampIntegrity(actualBudget.fechaEnvioPPTO04)
    ) {
      budgetDifferences.fechaEnvioPPTO04 = actualBudget.fechaEnvioPPTO04;
    }

    if (
      newBudget.motivoDeModificacion04 !== actualBudget.motivoDeModificacion04
    ) {
      budgetDifferences.motivoDeModificacion04 =
        actualBudget.motivoDeModificacion04;
    }

    if (
      newBudget.detalleDeModificacion04 !== actualBudget.detalleDeModificacion04
    ) {
      budgetDifferences.detalleDeModificacion04 =
        actualBudget.detalleDeModificacion04;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaDeAprobacionORechazo) >
      this.parseTimestampIntegrity(actualBudget.fechaDeAprobacionORechazo)
    ) {
      budgetDifferences.fechaDeAprobacionORechazo =
        actualBudget.fechaDeAprobacionORechazo;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaReleasedIoChild) >
      this.parseTimestampIntegrity(actualBudget.fechaReleasedIoChild)
    ) {
      budgetDifferences.fechaReleasedIoChild =
        actualBudget.fechaReleasedIoChild;
    }

    if (newBudget.statusPresupuesto !== actualBudget.statusPresupuesto) {
      budgetDifferences.statusPresupuesto = actualBudget.statusPresupuesto;
    }

    if (newBudget.motivoDelRechazo !== actualBudget.motivoDelRechazo) {
      budgetDifferences.motivoDelRechazo = actualBudget.motivoDelRechazo;
    }

    if (newBudget.detalleDelRechazo !== actualBudget.detalleDelRechazo) {
      budgetDifferences.detalleDelRechazo = actualBudget.detalleDelRechazo;
    }

    if (newBudget.vv$servicios !== actualBudget.vv$servicios) {
      budgetDifferences.vv$servicios = actualBudget.vv$servicios;
    }

    if (
      newBudget.vv$adicionalesServicios !== actualBudget.vv$adicionalesServicios
    ) {
      budgetDifferences.vv$adicionalesServicios =
        actualBudget.vv$adicionalesServicios;
    }

    if (
      newBudget.vv$descuentoServicios !== actualBudget.vv$descuentoServicios
    ) {
      budgetDifferences.vv$descuentoServicios =
        actualBudget.vv$descuentoServicios;
    }

    if (newBudget.vv$repuestos !== actualBudget.vv$repuestos) {
      budgetDifferences.vv$repuestos = actualBudget.vv$repuestos;
    }

    if (
      newBudget.vv$adicionalesRepuestos !== actualBudget.vv$adicionalesRepuestos
    ) {
      budgetDifferences.vv$adicionalesRepuestos =
        actualBudget.vv$adicionalesRepuestos;
    }

    if (
      newBudget.vv$descuentoRepuestos !== actualBudget.vv$descuentoRepuestos
    ) {
      budgetDifferences.vv$descuentoRepuestos =
        actualBudget.vv$descuentoRepuestos;
    }

    if (newBudget.totalvvPPTOUS$ !== actualBudget.totalvvPPTOUS$) {
      budgetDifferences.totalvvPPTOUS$ = actualBudget.totalvvPPTOUS$;
    }

    if (newBudget.$componenteNuevo !== actualBudget.$componenteNuevo) {
      budgetDifferences.$componenteNuevo = actualBudget.$componenteNuevo;
    }

    if (newBudget.reparacion60 !== actualBudget.reparacion60) {
      budgetDifferences.reparacion60 = actualBudget.reparacion60;
    }

    if (newBudget.horasSTD !== actualBudget.horasSTD) {
      budgetDifferences.horasSTD = actualBudget.horasSTD;
    }

    if (newBudget.horasReales !== actualBudget.horasReales) {
      budgetDifferences.horasReales = actualBudget.horasReales;
    }

    if (
      this.parseDateIntegrity(newBudget.tiempoObjetivoEnvioPPTO) >
      this.parseTimestampIntegrity(actualBudget.tiempoObjetivoEnvioPPTO)
    ) {
      budgetDifferences.tiempoObjetivoEnvioPPTO =
        actualBudget.tiempoObjetivoEnvioPPTO;
    }

    if (
      newBudget.diasRestantesEnvioPPTO !== actualBudget.diasRestantesEnvioPPTO
    ) {
      budgetDifferences.diasRestantesEnvioPPTO =
        actualBudget.diasRestantesEnvioPPTO;
    }

    if (
      newBudget.NoPPTOSModificadosOAdicionales !==
      actualBudget.NoPPTOSModificadosOAdicionales
    ) {
      budgetDifferences.NoPPTOSModificadosOAdicionales =
        actualBudget.NoPPTOSModificadosOAdicionales;
    }

    if (
      newBudget.observacionesEnElPresupuesto !==
      actualBudget.observacionesEnElPresupuesto
    ) {
      budgetDifferences.observacionesEnElPresupuesto =
        actualBudget.observacionesEnElPresupuesto;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaDeTerminoDeRep) >
      this.parseTimestampIntegrity(actualBudget.fechaDeTerminoDeRep)
    ) {
      budgetDifferences.fechaDeTerminoDeRep = actualBudget.fechaDeTerminoDeRep;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaUltimoInput) >
      this.parseTimestampIntegrity(actualBudget.fechaUltimoInput)
    ) {
      budgetDifferences.fechaUltimoInput = actualBudget.fechaUltimoInput;
    }

    if (newBudget.motivoDeInput !== actualBudget.motivoDeInput) {
      budgetDifferences.motivoDeInput = actualBudget.motivoDeInput;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaDeFactDeTaller) >
      this.parseTimestampIntegrity(actualBudget.fechaDeFactDeTaller)
    ) {
      budgetDifferences.fechaDeFactDeTaller = actualBudget.fechaDeFactDeTaller;
    }

    if (
      newBudget.costo$ServiciosCliente !== actualBudget.costo$ServiciosCliente
    ) {
      budgetDifferences.costo$ServiciosCliente =
        actualBudget.costo$ServiciosCliente;
    }

    if (
      newBudget.costo$ServiciosDeOperacion !==
      actualBudget.costo$ServiciosDeOperacion
    ) {
      budgetDifferences.costo$ServiciosDeOperacion =
        actualBudget.costo$ServiciosDeOperacion;
    }

    if (
      newBudget.rentabilidadServiciosPercent !==
      actualBudget.rentabilidadServiciosPercent
    ) {
      budgetDifferences.rentabilidadServiciosPercent =
        actualBudget.rentabilidadServiciosPercent;
    }

    if (
      newBudget.costo$RepuestosCLIENTE !== actualBudget.costo$RepuestosCLIENTE
    ) {
      budgetDifferences.costo$RepuestosCLIENTE =
        actualBudget.costo$RepuestosCLIENTE;
    }

    if (
      newBudget.costo$RepuestosOperacion !==
      actualBudget.costo$RepuestosOperacion
    ) {
      budgetDifferences.costo$RepuestosOperacion =
        actualBudget.costo$RepuestosOperacion;
    }

    if (
      newBudget.rentabilidadRepuestosPercent !==
      actualBudget.rentabilidadRepuestosPercent
    ) {
      budgetDifferences.rentabilidadRepuestosPercent =
        actualBudget.rentabilidadRepuestosPercent;
    }

    if (newBudget.observacionesTaller !== actualBudget.observacionesTaller) {
      budgetDifferences.observacionesTaller = actualBudget.observacionesTaller;
    }

    if (
      newBudget.realDevueltoAServicios !== actualBudget.realDevueltoAServicios
    ) {
      budgetDifferences.realDevueltoAServicios =
        actualBudget.realDevueltoAServicios;
    }

    if (newBudget.diferenciaServicios !== actualBudget.diferenciaServicios) {
      budgetDifferences.diferenciaServicios = actualBudget.diferenciaServicios;
    }

    if (
      newBudget.realDevueltoARepuestos !== actualBudget.realDevueltoARepuestos
    ) {
      budgetDifferences.realDevueltoARepuestos =
        actualBudget.realDevueltoARepuestos;
    }

    if (newBudget.diferenciaRepuestos !== actualBudget.diferenciaRepuestos) {
      budgetDifferences.diferenciaRepuestos = actualBudget.diferenciaRepuestos;
    }

    if (newBudget.totalVVFacturadoUS$ !== actualBudget.totalVVFacturadoUS$) {
      budgetDifferences.totalVVFacturadoUS$ = actualBudget.totalVVFacturadoUS$;
    }

    if (
      this.parseDateIntegrity(newBudget.mesFactVenta) >
      this.parseTimestampIntegrity(actualBudget.mesFactVenta)
    ) {
      budgetDifferences.mesFactVenta = actualBudget.mesFactVenta;
    }

    if (
      newBudget.percentHorasSTDvsHorasDBS !==
      actualBudget.percentHorasSTDvsHorasDBS
    ) {
      budgetDifferences.percentHorasSTDvsHorasDBS =
        actualBudget.percentHorasSTDvsHorasDBS;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaFirstLabour) >
      this.parseTimestampIntegrity(actualBudget.fechaFirstLabour)
    ) {
      budgetDifferences.fechaFirstLabour = actualBudget.fechaFirstLabour;
    }

    if (
      this.parseDateIntegrity(newBudget.fechaLastLabour) >
      this.parseTimestampIntegrity(actualBudget.fechaLastLabour)
    ) {
      budgetDifferences.fechaLastLabour = actualBudget.fechaLastLabour;
    }

    if (newBudget.diasDemoraFact !== actualBudget.diasDemoraFact) {
      budgetDifferences.diasDemoraFact = actualBudget.diasDemoraFact;
    }

    if (newBudget.diasFactLastLabour !== actualBudget.diasFactLastLabour) {
      budgetDifferences.diasFactLastLabour = actualBudget.diasFactLastLabour;
    }

    if (newBudget.elaborarPPTO !== actualBudget.elaborarPPTO) {
      budgetDifferences.elaborarPPTO = actualBudget.elaborarPPTO;
    }

    if (newBudget.tipoDeComponente !== actualBudget.tipoDeComponente) {
      budgetDifferences.tipoDeComponente = actualBudget.tipoDeComponente;
    }

    if (newBudget.tipoAAorPandP !== actualBudget.tipoAAorPandP) {
      budgetDifferences.tipoAAorPandP = actualBudget.tipoAAorPandP;
    }

    if (newBudget.taller02 !== actualBudget.taller02) {
      budgetDifferences.taller02 = actualBudget.taller02;
    }

    if (
      newBudget.diasDesdeAperturaChild !== actualBudget.diasDesdeAperturaChild
    ) {
      budgetDifferences.diasDesdeAperturaChild =
        actualBudget.diasDesdeAperturaChild;
    }

    if (
      newBudget.resumen instanceof Date &&
      actualBudget.resumen instanceof Date
    ) {
      if (
        this.parseDateIntegrity(newBudget.resumen) >
        this.parseTimestampIntegrity(actualBudget.resumen)
      ) {
        budgetDifferences.resumen = actualBudget.resumen;
      }
    }

    if (newBudget.definicionDeCargos !== actualBudget.definicionDeCargos) {
      budgetDifferences.definicionDeCargos = actualBudget.definicionDeCargos;
    }

    if (
      newBudget.informe instanceof Date &&
      actualBudget.informe instanceof Date
    ) {
      if (
        this.parseDateIntegrity(newBudget.informe) >
        this.parseTimestampIntegrity(actualBudget.informe)
      ) {
        budgetDifferences.informe = actualBudget.informe;
      }
    }

    if (
      newBudget.cotizacionFesa instanceof Date &&
      actualBudget.cotizacionFesa instanceof Date
    ) {
      if (
        this.parseDateIntegrity(newBudget.cotizacionFesa) >
        this.parseTimestampIntegrity(actualBudget.cotizacionFesa)
      ) {
        budgetDifferences.cotizacionFesa = actualBudget.cotizacionFesa;
      }
    }

    if (
      newBudget.cotizacionText instanceof Date &&
      actualBudget.cotizacionText instanceof Date
    ) {
      if (
        this.parseDateIntegrity(newBudget.cotizacionText) >
        this.parseTimestampIntegrity(actualBudget.cotizacionText)
      ) {
        budgetDifferences.cotizacionText = actualBudget.cotizacionText;
      }
    }

    if (newBudget.statusFacturacion !== actualBudget.statusFacturacion) {
      budgetDifferences.statusFacturacion = actualBudget.statusFacturacion;
    }

    return budgetDifferences;
  }

  parseDateIntegrity(date: Date): number | null {
    if (date === null) {
      return 0;
    } else {
      return date.getTime();
    }
  }

  parseTimestampIntegrity(
    date: firebase.default.firestore.Timestamp
  ): number | null {
    if (date === null) {
      return 0;
    } else {
      return date.toMillis();
    }
  }

  uploadDailyExcelBatchArray(
    list: Array<Budget>,
    firestoreBudgetsSnapshot: firebase.default.firestore.QuerySnapshot<Budget>
  ): Observable<firebase.default.firestore.WriteBatch[]> {
    let batchCount = Math.ceil(list.length / 500);
    let batchArray = [];

    // Get all the woChild from the db
    let firestoreWOChildList: Array<number> = [];

    // Get all the woMain from the db
    let firestoreWOMainList: Array<number> = [];

    // Check if there are documents in the QuerySnapshot
    if (!firestoreBudgetsSnapshot.empty) {
      firestoreBudgetsSnapshot.forEach((doc) => {
        const data = doc.data();

        // Populate the arrays
        if (data.woChild) firestoreWOChildList.push(data.woChild);
        if (data.woMain) firestoreWOMainList.push(data.woMain);
      });
    }

    for (let index = 0; index < batchCount; index++) {
      const batch = this.afs.firestore.batch();
      let limit =
        500 * (index + 1) > list.length ? list.length : 500 * (index + 1);

      for (let j = 500 * index; j < limit; j++) {
        const budgetsDocRef = this.afs.firestore
          .collection(`/db/ferreyros/budgets`)
          .doc();

        const currentBudget = list[j];

        // Assign an id to the current row budget document
        currentBudget.id = budgetsDocRef.id;

        if (currentBudget.woChild) {
          // Vertify that woChild doesn't repeat in the db

          // If this array contains data then you shouldn't add data to Firestore
          const repeatedWOChildList: Array<number> = [];

          if (firestoreWOChildList.length > 0) {
            firestoreWOChildList.forEach((woChild) => {
              if (currentBudget.woChild == woChild)
                repeatedWOChildList.push(woChild);
            });
          }

          if (!(repeatedWOChildList.length > 0))
            batch.set(budgetsDocRef, currentBudget);
        } else {
          // Verify that woMain doesn't repeat in the db

          const repeatedWOMainList: Array<number> = [];

          if (firestoreWOMainList.length > 0) {
            firestoreWOMainList.forEach((woMain) => {
              if (currentBudget.woMain == woMain)
                repeatedWOMainList.push(woMain);
            });
          }

          if (!(repeatedWOMainList.length > 0))
            batch.set(budgetsDocRef, currentBudget);
        }
      }

      batchArray.push(batch);
    }
    return of(batchArray);
  }

  uploadDailyEntries(
    list: Array<Budget>
  ): Observable<firebase.default.firestore.WriteBatch[]> {
    let batchCount = Math.ceil(list.length / 500);
    let batchArray = [];

    for (let index = 0; index < batchCount; index++) {
      const batch = this.afs.firestore.batch();
      let limit =
        500 * (index + 1) > list.length ? list.length : 500 * (index + 1);

      for (let j = 500 * index; j < limit; j++) {
        const budgetsDocRef = this.afs.firestore
          .collection(`/db/ferreyros/budgets`)
          .doc();

        const currentBudget = list[j];

        // Assign an id to the current row budget document
        currentBudget.id = budgetsDocRef.id;

        if (!currentBudget['duplicated']) {
          delete currentBudget['checkUpgrade'];
          delete currentBudget['applyUpgrade'];
          delete currentBudget['duplicated'];
          delete currentBudget['budgetId'];
          delete currentBudget['budgetDifferences'];
          currentBudget['versionCount'] = 0;

          batch.set(budgetsDocRef, currentBudget);
        } else if (currentBudget['applyUpgrade']) {
          const diffKeys = Object.keys(currentBudget['budgetDifferences']);
          
          let budgetUpgrade: Partial<Budget> = {};

          diffKeys.forEach((key) => {
            budgetUpgrade[key] = currentBudget[key];
          });
          
          const actualBudgetRef = this.afs.firestore.doc(
            `/db/ferreyros/budgets/${currentBudget['budgetId']}`
          );

          batch.update(actualBudgetRef, budgetUpgrade);
        }
      }

      batchArray.push(batch);
    }
    return of(batchArray);
  }

  updateBudgetFields(
    id: string,
    budget: Budget,
    fields: object,
    additionals: additionalsForms
   
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    

   fields = {
    NoPPTOSModificadosOAdicionales: budget.NoPPTOSModificadosOAdicionales + additionals.additionals.length,
    cotizacionFesa: budget.cotizacionFesa,
    cotizacionText: budget.cotizacionText,
    informe:budget.informe

   }

    batch.update(docRef, fields);
    return of(batch);
  }

  updateModifyReason(
    id: string,
    reason: modificationReasonForm,
    budget: Budget,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    const modificationData: ModificationReasonEntry = {
      id: docRef.id,
      name: reason.modificationReason.name,
      createdBy: user,
      additionals: reason.additionals,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
    };

    let data;

    // Evaluar slots disponibles

    if (!budget.motivoDeModificacion02) {
      data = {
        motivoDeModificacion02: modificationData,
        detalleDeModificacion02: reason.modificationReason.name,
        statusPresupuesto: 'PPTO. MODIFICADO',
        NoPPTOSModificadosOAdicionales:
          budget.NoPPTOSModificadosOAdicionales + reason.additionals.length,
      };
      batch.update(docRef, data);
      return of(batch);
    }

    if (!budget.motivoDeModificacion03) {
      data = {
        motivoDeModificacion03: modificationData,
        detalleDeModificacion03: reason.modificationReason.name,
        statusPresupuesto: 'PPTO. MODIFICADO',
        NoPPTOSModificadosOAdicionales:
          budget.NoPPTOSModificadosOAdicionales + reason.additionals.length,
      };
      batch.update(docRef, data);
      return of(batch);
    }

    if (!budget.motivoDeModificacion04) {
      data = {
        motivoDeModificacion04: modificationData,
        detalleDeModificacion04: reason.modificationReason.name,
        statusPresupuesto: 'PPTO. MODIFICADO',
        NoPPTOSModificadosOAdicionales:
          budget.NoPPTOSModificadosOAdicionales + reason.additionals.length,
      };

      batch.update(docRef, data);
      return of(batch);
    }
  }

updateRejectionReason(
    id: string,
    reason: rejectionReasonForm,
    status: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    let data;

    const rejectionData: RejectionReasonsEntry = {
      id: docRef.id,
      name: reason.rejectionReason.name,
      detail: reason.detailReason,
      createdBy: user,
      createdAt: new Date(),
    };
      
    // data = {
    //   motivoDelRechazo: rejectionData,
    //   statusPresupuesto: status,
    // };

    data = {
      fechaDeAprobacionORechazo: firebase.default.firestore.FieldValue.serverTimestamp(),
      motivoDelRechazo: reason.rejectionReason.name,
      rechazadoPor: user,
      detalleDelRechazo: reason.detailReason,
      statusPresupuesto: status,
    };

    batch.update(docRef, data);
    return of(batch);
  }

  getBudgets(): Observable<Budget[]> {
    const ref = this.afs.collection<Budget>('/db/ferreyros/budgets');
    return ref.valueChanges().pipe(shareReplay(1));
  }

  getBudgetsPendingSend(): Observable<Budget[]> {
    const ref = this.afs.collection<Budget>('/db/ferreyros/budgets', (ref) =>
      ref.where('statusPresupuesto', '==', 'PDTE. ENVÍO PPTO.')
    );

    return ref.valueChanges().pipe(shareReplay(1));
  }

  getBudgetsPendingApproval(): Observable<Budget[]> {
    const ref = this.afs.collection<Budget>('/db/ferreyros/budgets', (ref) =>
      ref.where('statusPresupuesto', 'in', ['PDTE. APROB.', 'PPTO. MODIFICADO'])
    );

    return ref.valueChanges().pipe(shareReplay(1));
  }

  getBudgetsSnapshot(): Observable<
    firebase.default.firestore.QuerySnapshot<Budget>
  > {
    const ref = this.afs.collection<Budget>('/db/ferreyros/budgets');

    const refSnapshot = ref.get();

    return refSnapshot;
  }

  updateBudgetAprove(
    id: string,
    status: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    // const approvedData: ApprovedEntry = {
    //   createdBy: user,
    //   createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
    // };

    const data = {
      fechaDeAprobacionORechazo:  firebase.default.firestore.FieldValue.serverTimestamp(),
      statusPresupuesto: status,
      aprobadoPor: user
    };

    batch.update(docRef, data);

    return of(batch);
  }

  public getAllReasonsForRejectionEntries(): Observable<
    RejectionReasonsEntry[]
  > {
    return this.afs
      .collection<RejectionReasonsEntry>(
        '/db/generalConfig/budgetsListRejectionReasons',
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  public getAllReasonsForModificationEntries(): Observable<
    ModificationReasonEntry[]
  > {
    return this.afs
      .collection<ModificationReasonEntry>(
        '/db/generalConfig/budgetsListModificationReasons',
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  public addReasonForRejectionEntry(
    listReasonsForRejection: Array<RejectionReasonsEntry>,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = firebase.default.firestore.FieldValue.serverTimestamp();
    const batch: firebase.default.firestore.WriteBatch =
      this.afs.firestore.batch();

    listReasonsForRejection.forEach(
      (reasonForRejection: RejectionReasonsEntry) => {
        const listReasonsForRejectionDocumentRef = this.afs.firestore
          .collection('/db/generalConfig/budgetsListRejectionReasons')
          .doc();

        if (!reasonForRejection.id) {
          batch.set(listReasonsForRejectionDocumentRef, {
            id: listReasonsForRejectionDocumentRef.id,
            name: reasonForRejection.name,
            createdAt: date,
            createdBy: user,
          });
        }
      }
    );

    return of(batch);
  }

  public addReasonForModificationEntry(
    listReasonsForModification: Array<ModificationReasonEntry>,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = firebase.default.firestore.FieldValue.serverTimestamp();
    const batch: firebase.default.firestore.WriteBatch =
      this.afs.firestore.batch();

    listReasonsForModification.forEach(
      (reasonForModification: ModificationReasonEntry) => {
        const listReasonsForRejectionDocumentRef = this.afs.firestore
          .collection('/db/generalConfig/budgetsListModificationReasons')
          .doc();

        if (!reasonForModification.id) {
          batch.set(listReasonsForRejectionDocumentRef, {
            id: listReasonsForRejectionDocumentRef.id,
            name: reasonForModification.name,
            createdAt: date,
            createdBy: user,
          });
        }
      }
    );

    return of(batch);
  }

  public deleteReasonsForRejectionEntry(id: string) {
    this.afs.firestore
      .collection('/db/generalConfig/budgetsListRejectionReasons')
      .doc(id)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  }

  public deleteReasonsForModificationEntry(id: string) {
    this.afs.firestore
      .collection('/db/generalConfig/budgetsListModificationReasons')
      .doc(id)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  }

  public addNewBroadcastList(
    groupName: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();

    const docRef = this.afs.firestore
      .collection('/db/generalConfig/budgetsBroadcastList')
      .doc();

    batch.set(docRef, {
      id: docRef.id,
      name: groupName,
      emailList: null,
      createdBy: user,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
    });

    return of(batch);
  }

  public getAllBroadcastList(): Observable<Array<BudgetsBroadcastList>> {
    return this.afs
      .collection<BudgetsBroadcastList>(
        `/db/generalConfig/budgetsBroadcastList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  public getDateHistory(budget: Budget): Array<BudgetHistoryDate> {
    let tempArray = [];
    //Verificar fecha
    if (budget.fechaAperturaChild) {
      const fecha = this.getStringFromTimestamp(budget.fechaAperturaChild);
      const milliSeconds = budget.fechaAperturaChild.seconds * 1000;
      
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha apertura child',
          date: fecha,
          milli: milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }

    if (budget.fechaDeAprobacionORechazo) {
      const fecha = this.getStringFromTimestamp(budget.fechaDeAprobacionORechazo);
      const milliSeconds = budget.fechaDeAprobacionORechazo.seconds * 1000;
      

      
    
      if (fecha !== '---') {
      
        
        if( budget.rechazadoPor){
          const data: BudgetHistoryDate = {
            type:'Fecha Rechazo',
            date: fecha,
            milli: milliSeconds,
            createBy: budget.rechazadoPor,
            description: budget.motivoDelRechazo
          };
          tempArray.push(data);
        }
        if( budget.aprobadoPor){
          const data: BudgetHistoryDate = {
            type:'Fecha Aprobación',
            date: fecha,
            milli: milliSeconds,
            createBy: budget.aprobadoPor,
          };
          tempArray.push(data);
        }
       
      }
    }

    if (budget.fechaDeFactDeTaller) {
      const fecha = this.getStringFromTimestamp(budget.fechaDeFactDeTaller);
      const milliSeconds = budget.fechaDeFactDeTaller.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha de facturación de taller',
          date: fecha,
          milli: milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }
    if (budget.fechaDeTerminoDeRep) {
      const fecha = this.getStringFromTimestamp(budget.fechaDeTerminoDeRep);
      const milliSeconds = budget.fechaDeTerminoDeRep.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha de Termino de resp',
          date: fecha,
          milli: milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }
    if (budget.fechaDefinicionDeCargos) {
      const fecha = this.getStringFromTimestamp(budget.fechaDefinicionDeCargos);
      const milliSeconds = budget.fechaDefinicionDeCargos.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha definición de cargos',
          date: fecha,
          milli: milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }

    if (budget.fechaFirstLabour) {
      const fecha = this.getStringFromTimestamp(budget.fechaFirstLabour);
      const milliSeconds = budget.fechaFirstLabour.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha first labour',
          date: fecha,
          milli:milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }

    if (budget.fechaLPD) {
      const fecha = this.getStringFromTimestamp(budget.fechaLPD);
      const milliSeconds = budget.fechaLPD.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha LPD',
          date: fecha,
          milli:milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }

    if (budget.fechaLastLabour) {
      const fecha = this.getStringFromTimestamp(budget.fechaLastLabour);
      const milliSeconds = budget.fechaLastLabour.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha last labour',
          date: fecha,
          milli:milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }
    if (budget.fechaReleasedIoChild) {
      const fecha = this.getStringFromTimestamp(budget.fechaReleasedIoChild);
      const milliSeconds = budget.fechaReleasedIoChild.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha released io child',
          date: fecha,
          milli:milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }
    if (budget.fechaUltimoEnvioDocumentoADM) {
      const fecha = this.getStringFromTimestamp(
        budget.fechaUltimoEnvioDocumentoADM
      );
      const milliSeconds = budget.fechaUltimoEnvioDocumentoADM.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha último envío dcto (ADM)',
          date: fecha,
          milli:milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }
    if (budget.fechaUltimoEnvioPPTO) {
      const fecha = this.getStringFromTimestamp(budget.fechaUltimoEnvioPPTO);
      const milliSeconds = budget.fechaUltimoEnvioPPTO.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha último envío PPTO',
          date: fecha,
          milli:milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }

    if (budget.fechaUltimoInput) {
      const fecha = this.getStringFromTimestamp(budget.fechaUltimoInput);
      const milliSeconds = budget.fechaUltimoInput.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha último input',
          date: fecha,
          milli:milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }

    if (budget.fechaUltimoListado) {
      const fecha = this.getStringFromTimestamp(budget.fechaUltimoListado);
      const milliSeconds = budget.fechaUltimoListado.seconds * 1000;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha último listado',
          date: fecha,
          milli:milliSeconds,
          createBy: null,
        };
        tempArray.push(data);
      }
    }

    if (budget.motivoDeModificacion02) {
      const fecha = this.getStringFromTimestamp(
        budget.motivoDeModificacion02.createdAt
      );
      const milliSeconds = budget.motivoDeModificacion02.createdAt['seconds'] * 1000;
    
      const usuario = budget.motivoDeModificacion02.createdBy;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha última modificación 1',
          date: fecha,
          milli: milliSeconds,
          createBy: usuario,
          description: budget.motivoDeModificacion02.name,
        };
        tempArray.push(data);
      }
    }

    if (budget.motivoDeModificacion03) {
      const fecha = this.getStringFromTimestamp(
        budget.motivoDeModificacion03.createdAt
      );
      const milliSeconds = budget.motivoDeModificacion03.createdAt['seconds'] * 1000;
      
      const usuario = budget.motivoDeModificacion03.createdBy;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha última modificación 2',
          date: fecha,
          milli: milliSeconds,
          createBy: usuario,
          description: budget.motivoDeModificacion03.name,
        };
        tempArray.push(data);
      }
    }

    if (budget.motivoDeModificacion04) {
      const fecha = this.getStringFromTimestamp(
        budget.motivoDeModificacion04.createdAt
      );
      const milliSeconds = budget.motivoDeModificacion04.createdAt['seconds'] * 1000;


      const usuario = budget.motivoDeModificacion04.createdBy;
      if (fecha !== '---') {
        const data: BudgetHistoryDate = {
          type: 'Fecha última modificación 3',
          date: fecha,
          milli: milliSeconds,
          createBy: usuario,
          description: budget.motivoDeModificacion04.name,
        };
        tempArray.push(data);
       
      }
    }

    tempArray.sort( (a: any , b: any) => b.milli - a.milli)
   
  
    return tempArray.sort();
  }

  public compareNumbers(a, b) {
    return a - b;
  }


  public TimestampDate( timestamp: any){
       const seconds: any = timestamp;

      //  if(seconds == null  || seconds.seconds <= 0) return '---'

       const date = moment.utc(seconds.seconds * 1000);

       return date;
  }


  public getStringFromTimestamp(timestamp: any): string {
    const seconds: any = timestamp;

    // If date is unvalid or doesn't exist
    if (seconds == null || seconds.seconds <= 0) return '---';
     
    const date: string = moment
      .utc(seconds.seconds * 1000)
      .format('DD/MM/YYYY HH:mm');
    // HH:mm:ss

    return date;
  }

  public getStringFromDate(date: Date): string {
    if (!date) {
      return '---';
    }

    const dateString: string = moment.utc(date).format('DD/MM/YYYY');

    return dateString;
  }

  public updateBroadcastEmailList(
    entryId: string,
    broadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef = this.afs.firestore.doc(
      `/db/generalConfig/budgetsBroadcastList/${entryId}`
    );
    const data: any = {
      emailList: firebase.default.firestore.FieldValue.arrayRemove(broadcast),
      editedAt: new Date(),
      edited: user,
    };
    batch.update(docRef, data);

    return of(batch);
  }

  public updateBroadcastList(
    entryId: string,
    broadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef = this.afs.firestore.doc(
      `/db/generalConfig/budgetsBroadcastList/${entryId}`
    );

    const data: any = {
      emailList: firebase.default.firestore.FieldValue.arrayUnion(broadcast),
      editedAt: new Date(),
      edited: user,
    };
    batch.update(docRef, data);

    return of(batch);
  }

  public deleteBudget(id: string): Observable<Promise<void>> {
    return of(
      this.afs.firestore.collection('/db/ferreyros/budgets').doc(id).delete()
    );
  }
}
