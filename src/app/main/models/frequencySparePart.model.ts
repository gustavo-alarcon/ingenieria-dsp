import { ShortUser } from './user-model';

export interface FrequencySparePart {
  id: string;
  partNumber: string;
  frequency: number;
  avgQty: number;
  minQty: number;
  maxQty: number;
  createdAt: Date & firebase.default.firestore.Timestamp;
  createdBy: ShortUser;
  editedAt?: (Date & firebase.default.firestore.Timestamp) | null;
  editedBy?: ShortUser | null;
}
