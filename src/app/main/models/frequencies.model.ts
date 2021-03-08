import { User } from "./user-model";

export interface FrequencyEntry {
    cuno: string;
    wono: string;
    wosgno: number;
    woopno: number;
    pano20: string;
    component: string;
    arrangement: string;
    eqmfmd: string;
    spqty: number;
}

export interface FrequencyCalc {
    id: string;
    pano20: string;
    component: string;
    frequency: number;
    min: number;
    max: number;
    createdAt: Date;
    createdBy: User;
    editedAt: Date;
    editedBy: User;
}