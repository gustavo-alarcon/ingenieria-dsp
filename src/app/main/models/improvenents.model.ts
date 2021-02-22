import { User } from "./user-model";

// This interface should be used to store validated improvements in firestore improvements collection
export interface Improvement {
  id: string;
  date: Date;
  name: string;
  component: string;
  description: string;
  criticalPart: boolean;
  rate: boolean;
  model: string;
  media: string;
  quantity: number;
  currentPart: string;
  improvedPart: string;
  stock: number;
  availability: Date;
  kit: boolean;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}

// This interface should be used with improvement create/edit form.
export interface improvementsForm {
  component: string;
  criticalPart: boolean;
  rate: boolean;
  description: string;
  model: string;
  name: string;
  parts: Array<ImprovementPart>
}

// This interface should be used to store an improvement entry in firestore improvementEntries collection.
export interface ImprovementEntry {
  id: string;
  date: Date;
  name: string;
  component: string;
  criticalPart: boolean;
  rate: boolean;
  model: string;
  description: string;
  parts: Array<ImprovementPart>;
  state: string;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}

export interface ImprovementPart {
  quantity: number;
  currentPart: string;
  improvedPart: string;
  kit: boolean;
  sparePart: string;
  stock?: number;
  availability?: string;
}
