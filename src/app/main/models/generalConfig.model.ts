export interface GeneralConfig {
  processTimer: {
    days: number;
    hours: number;
    minute: number;
  };
  registryTimer: {
    days: number;
    hours: number;
    minute: number;
  };
  frequencyThreshold: number;
  version: string;
}
