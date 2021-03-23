import { User } from "./user-model";

export interface InitialEvaluation {
    id: string;
    ot: string;
    status: 'reception' | 'dispatch';
    dataReception: {name: string, imageURL: string}[];
    dataDispatch?: {name: string, imageURL: string}[];
    createdAt: Date;
    createdBy: User;
    dispatchedAt?: Date;
    dispatchedBy?: User;
}