import { EvaluationTimer } from "src/app/main/models/evaluations.model";

export interface GeneralConfig {
    version: string
    registryTimer: EvaluationTimer,
    processTimer: EvaluationTimer
}