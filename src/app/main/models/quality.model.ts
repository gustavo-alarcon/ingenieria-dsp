import { User } from './user-model';
import { WorkshopModel } from './workshop.model';

export interface Quality {
  id?: string;
  createdAt: Date;
  createdBy: User;
  editedAt?: Date;
  edited?: User;

  registryTimer?: any;
  registryTimeElapsed?: QualityTimer;
  registryPercentageElapsed?: number;

  processAt?: Date;
  processTimer?: any;
  processTimeElapsed?: QualityTimer;
  processPercentageElapsed?: number;

  tracingAt?: Date;
  tracingTimer?: any;
  tracingTimeElapsed?: QualityTimer;
  tracingPercentageElapsed?: number;

  finalizedAt?: Date;
  finalizedTimer?: any;
  finalizedTimeElapsed?: QualityTimer;
  finalizedPercentageElapsed?: number;

  fileName?: string;
  inquiryAt?: Date;
  attentionTimeElapsed?: QualityTimer;
  //finalizedAt?: Date;
  //finalizedBy: User;
  analysisQuality?: string;
  analysisCost?: string;
  analysisFrequency?: string;
  //analysisCauseFailure: string;
  //analysisProcess: string;
  //analysisObservation: string;
  evaluationAnalysisName?: string;
  fileAdditional?: FileAdditional;
  taskDone?: number;
  causeFailureList?: Array<string>;
  analysis?: Analysis;
  evaluationAnalisis?: number;
  eventType: string; //Interno- Externo
  emailList?: Array<string>;
  paralized?: boolean;
  workOrder?: number;
  component?: string;
  specialist?: string;
  partNumber?: number;
  workShop?: string; //responsible workshop
  reportingWorkshop?: WorkshopModel;
  reportingWorkshopProcess?: string;
  enventDetail?: string;
  packageNumber?: string;
  componentHourMeter?: string;
  miningOperation?: string;
  correctiveActions?: Array<object>;
  riskLevel?: string;
  state?: string; // => registered / process / tracing / finalized
  generalImages?: Array<string>;
  detailImages?: Array<string>;
  question1?: string;
  question2?: string;
  question3?: string;
  question4?: string;
  file?: string;
}

export interface Analysis {
  causeFailure: string;
  basicCause: string;
  responsibleWorkshop: string;
  process: string;
  observation: string;
  responsable: string;
  bahia: string;
  URLimage: string;
}

export interface QualityTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface QualityListSpecialist {
  id: string;
  name: string;
  role: string;
  email: string;
  picture: string;
  createdAt: Date;
  createdBy: User;
}

export interface QualityListResponsibleArea {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  createdBy: User;
}
export interface QualityBroadcastList {
  id?: string;
  name: string;
  emailList: Array<string>;
  createdAt: Date;
  createdBy: User;
  /* editedAt?: Date;
    edited?: User; */
}

export interface CauseFailureList {
  id?: string;
  name: string;
  createdAt: Date;
  createdBy: User;
}
export interface ProcessList {
  id?: string;
  name: string;
  createdAt: Date;
  createdBy: User;
}
export interface QualityList {
  code: number;
  name: string;
}
export interface CostList {
  code: number;
  name: string;
}
export interface FrequencyList {
  code: number;
  name: string;
}
export interface ComponentList {
  id: number;
  name: string;
  createdAt: Date;
}
export interface WorkshopList {
  id: number;
  name: string;
  createdBy: User;
  createdAt: Date;
}

export interface MiningOperation {
  id: number;
  name: string;
  createdAt: Date;
}
export interface FileAdditional {
  name: string;
  url: string;
}
