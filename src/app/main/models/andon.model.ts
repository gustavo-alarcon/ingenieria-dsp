import { User } from './user-model';
export interface Andon {
  id: string;
  createdAt: Date;
  createdBy: User;
  editedAt?: Date;
  edited?: User;
  reportDate: Date;
  workShop?: string;
  name: string;
  otChild: number;
  problemType?: string;
  description?: string;
  images?: Array<string>;
  registryTimer?: any;
  atentionTime: EvaluationTimer;
  reportUser: string;
  state: string; //=> stopped //retaken
  workReturnDate?: Date;
  comments?: string;
  returnUser?: string;
}

export interface EvaluationTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number
}

export interface AndonProblemType{
  id: string;
  problemType: string;
  createdAt: Date;
  createdBy: User;
}
export interface AndonListBahias{
  id: string;
  name: string;
  workShop: string;
  createdAt: Date;
  createdBy: User;
}

export interface AndonBroadcastList {
  id?: string;
  name: string;
  emailList: Array<string>;
  createdAt: Date;
  createdBy: User;
}