import { User } from "./user-model";

export interface WorkshopModel {
    workshopName: string;
    createdAt: Date;
    editedAt: Date;
    id: string;
    workshopProcessName: string[];
    createdBy?: User;
    updatedBy?: User;

}

export interface workshopForm {
    workshopName: string,
    workshopProcessName: string[]
}
