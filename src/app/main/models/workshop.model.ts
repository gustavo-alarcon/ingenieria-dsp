import { User } from "./user-model";

export interface WorkShopModel {
    workShopName: string;
    createdAt: Date;
    editedAt: Date;
    id: string;
    workShopProgressName: string[];
    createdBy?: User;
    updatedBy?: User;

}

export interface workShoForm {
    id:string,
    taller: string,
    createdBy: User,
    createdAt: Date
}
