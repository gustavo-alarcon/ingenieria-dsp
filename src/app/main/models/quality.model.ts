import { User } from './user-model';

export interface Quality{
    id?: string;
    createdAt: Date;
    createdBy: User;
    editedAt?: Date;
    edited?: User;

    registryTimer?: any;
    registryTimeElapsed?: QualityTimer;
    registryPercentageElapsed?: number;
    processAt?: Date;
    processTimer?: any;
    processTimeElapsed?: QualityTimer;
    processPercentageElapsed?: number;
    inquiryAt?: Date;
    attentionTimeElapsed?: QualityTimer;
    finalizedAt?: Date;
    finalizedBy: User;

    eventType: string; //Internal , External
    workOrder?: number;
    component?: string;
    description?: string;
    specialist?: string;
    partNumber?: number;
    workShop?: string;
    enventDetail?: string;
    packageNumber?: string;
    componentHourMeter?: string;
    miningOperation?: string;
    correctiveActions?: string;
    riskLevel?: string;
    state?: string;
    generalImages?: Array<string>;
    detailImages?: Array<string>;
    question1?: string;
    question2?: string;
    question3?: string;
    question4?: string;
    file?: string;
 
}

export interface QualityTimer {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export interface QualityListSpecialist{
    id: string;
    specialist: string;
    createdAt: Date;
    createdBy: User;
}

export interface QualityListResponsibleArea{
    id: string;
    responsable: string;
    createdAt: Date;
    createdBy: User;
}
export interface QualityBroadcastList{
    id?: string;
    name: string;
    emailList: Array<string>;
    createdAt: Date;
    createdBy: User;
    /* editedAt?: Date;
    edited?: User; */
}