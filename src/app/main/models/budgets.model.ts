import { User } from './user-model';
import * as firebase from 'firebase/app';

export interface rejectionReasonsEntry {
  id: string;
  name: string;
  createdBy: User;
  createdAt: firebase.default.firestore.FieldValue;
}

export interface modificationReasonEntry {
  id: string;
  name: string;
  createdBy: User;
  createdAt: firebase.default.firestore.FieldValue;
}

export interface BudgetsBroadcastList {
  id?: string;
  name: string;
  emailList: Array<string>;
  createdAt: firebase.default.firestore.FieldValue;
  createdBy: User;
}
