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
    // user?: string;
    wof: string; // Solicitud TR
    task: string; // Trabajo
    observations: string;
    workshop: string; // Taller
    images?: Array<string>;
    imagesCounter: number;
    inquiries?: Array<EvaluationInquiry>;
    inquiriesCounter: number;
    // registryDate?: Date; // Fecha de solicitud
    registryTimer?: EvaluationTimer;
    processAt?: Date;
    processTimer?: EvaluationTimer;
    inquiryAt?: Date;
    inquiryTimer?: EvaluationTimer;
    finalizedAt?: Date;
    finalizedBy: User;
    result?: string; // Esta info viene de una lista standard (pendiente)
    kindOfTest?: string;
    comments?: string;
    createdAt: Date;
    createdBy: User;
    editedAt: Date;
    editedBy: User;
}

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
    workshop: string;
}

export interface EvaluationFinishForm {
    result: string;
    kindOfTest: string;
    comments: string;
}

export interface EvaluationTimer {
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

// id: 'd9asd6759s5';
// answer: null;
// inquiry: 'Como debemos hacer el primer ensayo de materiales?';
// answerImage: 'https://firebase.09ad9asdysa9da8dasdas.com';
// inquiryImage: null;
// createdAt: Fecha de creación;
// createdBy: Usuario que consulto;
// answeredAt: null;
// answeredBy: null;

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
