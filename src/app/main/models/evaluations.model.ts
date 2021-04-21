import { User } from './user-model';

/**
 * Firestore document
 * Path of collection: db/ferreyros/evaluations
 */
export interface Evaluation {
    id: string;
    otMain: string; // Orden de trabajo
    otChild: string; // Segmento / Operación
    position: number; // Correlativo
    partNumber: string; // Nro de parte
    description: string;
    quantity: number;
    internalStatus: string; // registered //processed// finalized
    status: string; // Tipo de atención
    wof: string; // Solicitud TR
    task: string; // Trabajo
    observations: string;
    workshop: number | string; // Taller
    images?: Array<string>;
    imagesCounter: number;
    inquiries?: Array<EvaluationInquiry>;
    inquiriesCounter: number;
    registryTimer?: any;
    registryTimeElapsed?: EvaluationTimer;
    registryPercentageElapsed?: number;
    processAt?: Date;
    processTimer?: any;
    processTimeElapsed?: EvaluationTimer;
    processPercentageElapsed?: number;
    inquiryAt?: Date;
    attentionTimeElapsed?: EvaluationTimer;
    finalizedAt?: Date;
    finalizedBy: User;              //Inspector
    result?: string; // Esta info viene de una lista standard (pendiente)
    kindOfTest?: string;
    comments?: string;
    resultImage1?: string;
    resultImage2?:  string;
    createdAt: Date;
    createdBy: User;
    editedAt: Date;
    editedBy: User;
    length?: number;                //Siempre en mm
    extends?: string[];     
}
//Al que creo, al inspector y a la lista de difusion
export interface EvaluationRegistryForm {
    otMain: string; // Orden de trabajo
    otChild: string; // Segmento / Operación
    position: number; // Correlativo
    partNumber: string; // Nro de parte
    description: string;
    quantity: number;
    status: string; // Tipo de atención
    wof: string; // Orden de fabricación
    task: string; // Trabajo
    observations: string;
    workshop: string;
    result: string;
    kindOfTest: string;
    comments: string;
    length: string;
    extends: string[];
}

export interface EvaluationFinishForm {
    result: string;
    kindOfTest: string;
    comments: string;
    length: string;
    extends: string[];
}

export interface EvaluationTimer {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * Firestore document
 * Path of collection: db/ferreyros/evaluations/{id}/inquiries
 */
export interface EvaluationInquiry {
    id: string;
    answer: string;
    inquiry: string;
    answerImage?: string;
    inquiryImage?: string;
    createdAt: Date;
    createdBy: User;
    answeredAt: Date;
    answeredBy: User;
}

/**
 * Firestore document
 * Path of collection: db/generalConfig/evaluationsBroadcast
 */
export interface EvaluationsBroadcastUser {
    id: string;
    email: string;
    createdAt: Date;
    createdBy: User;
}

export interface EvaluationsResultTypeUser {
    id: string;
    resultType: string;
    createdAt: Date;
    createdBy: User;
}

export interface EvaluationsKindOfTest {
    id: string;
    kindOfTest: string;
    createdAt: Date;
    createdBy: User;
}

export interface EvaluationsUser {
    id: string;
    code: string;
    name: string;
    oficc: string;
    workingArea: string;
    description: string;
    email: string;
    userName: string;
    boss: string;
    bossEmail: string;
    createdAt: Date;
    createdBy: User;
    editedAt: Date;
    editedBy: User;
}

export interface EvaluationBroadcastList {
    id?: string;
    name: string;
    emailList: Array<string>;
    createdAt: Date;
    createdBy: User;
  }
