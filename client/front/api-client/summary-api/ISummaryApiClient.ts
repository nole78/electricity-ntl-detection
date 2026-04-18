export type AnomalyClassification = 0 | 1 | 2 | "Normal" | "TheftSuspected" | "GhostOrDeadMeters";

export interface FeederAnomalyResult {
  feeder11Id: number;
  feeder11Name: string | null;
  windowStart: string;
  windowEnd: string;
  actualEnergyKwh: number;
  expectedEnergyKwh: number;
  anomalyScorePercent: number;
  classification: AnomalyClassification;
  registeredDtCount: number;
  estimatedActiveDtCount: number;
  centroidLatitude: number | null;
  centroidLongitude: number | null;
}

export interface NtlSummaryResponse {
  windowStart: string;
  windowEnd: string;
  totalFeedersAnalyzed: number;
  normalCount: number;
  theftSuspectedCount: number;
  ghostOrDeadCount: number;
  totalEnergyDeliveredKwh: number;
  estimatedNtlEnergyKwh: number;
  estimatedNtlPercent: number;
  topOffenders: FeederAnomalyResult[];
}

export interface GetSummaryParams {
  from?: string;
  to?: string;
  signal?: AbortSignal;
}

export interface ISummaryApiClient {
  getSummary(params?: GetSummaryParams): Promise<NtlSummaryResponse>;
}
