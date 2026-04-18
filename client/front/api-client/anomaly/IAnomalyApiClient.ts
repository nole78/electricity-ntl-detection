export type AnomalyClassification = "Normal" | "TheftSuspected" | "GhostOrDeadMeters";

export interface FeederAnomaly {
  feeder11Id: number;
  feeder11Name: string;
  anomalyScorePercent: number;
  classification: AnomalyClassification;
  centroidLatitude: number;
  centroidLongitude: number;
}

export interface IAnomalyApiClient {
  getAnomalies(signal?: AbortSignal): Promise<FeederAnomaly[]>;
}
