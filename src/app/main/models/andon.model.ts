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
  atentionTime: Date;
  user: string;
  state: string; //=> stopped //retaken
  workReturnDate?: Date;
  comments?: string;
  returnUser?: string;
}

export interface AndonProblemType{
  id: string;
  problemType: string;
  createdAt: Date;
  createdBy: User;
}
