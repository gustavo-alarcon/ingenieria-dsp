import { User } from './user-model';

export interface Quality{
    id?: string;
    createdAt: Date;
    createdBy: User;
    editedAt?: Date;
    edited?: User;
    eventType: string; //Internal , External
    workOrder?: number;
    component?: string;
    description?: string;
    specialist?: string;
    partNumber?: string;
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