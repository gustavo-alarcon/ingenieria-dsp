import { User } from "./user-model";

/**
 * Firestore document
 * Path of collection: db/ferreyros/evaluations
 */
export interface Evaluation {
    id: string;
    otMain: string; //Orden de trabajo
    otChild: string; // Segmento / Operación
    position: number; // Correlativo
    partNumber: string; // Nro de parte
    description: string;
    quantity: number;
    internalStatus: string; // [registrado/solicitado, en proceso, finalizado] !!!¡¡¡=> registered //progress// finalized
    status: string; // Tipo de atención
    user?: string;
    wof: string; // Solicitud TR
    task: string; // Trabajo
    observations: string;
    workshop: string; // Taller
    images?: Array<string>;
    imagesCounter: number;
    inquiries?: Array<EvaluationInquiry>;
    inquiriesCounter: number;
    registryDate?: Date; // Fecha de solicitud
    registryTimer?: EvaluationTimer;
    processDate?: Date;
    processTimer?: EvaluationTimer;
    inquiryDate?: Date;
    inquiryTimer?: EvaluationTimer;
    result?: string; // ESta info viene de una lista standard (pendiente)
    kindOfTest?: string;
    comments?: string;
    createdAt: Date;
    createdBy: User;
    editedAt: Date;
    editedBy: User;
}

export interface EvaluationRegistryForm {
    otMain: string; //Orden de trabajo
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
 * Path of collection: db/ferreyros/ppmRequests/{id}/inquiries
 */
export interface EvaluationInquiry {
    id: string;
    answer: string;
    image: string;
    createdAt: Date;
    CreatedBy: User;
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