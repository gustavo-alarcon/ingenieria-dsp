import { Timestamp } from 'rxjs/internal/operators/timestamp';
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
