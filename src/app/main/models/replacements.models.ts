import { User } from "./user-model";

export interface Replacement {
    id: string;
    currentPart: string;
    replacedPart: string;
    description: string;
    kit: boolean;
    support: boolean;
    createdAt: Date;
    createdBy: User;
    editedAt: Date;
    editedBy: User;
}

export interface ReplacementsForm {
    parts: Array<ReplacementPart>;
}

export interface ReplacementPart {
    currentPart: string;
    replacedPart: string;
    description: string;
    kit: boolean;
    support: boolean;
}