export type OutageType =
  | "TelemetryGap"
  | "ActiveTelemetryOutage"
  | "ZeroVoltage"
  | "NoTelemetry";

export interface OutageInfo {
  meterId: number;
  detectedAt: string | null;
  description: string;
  dtId: number | null;
  dtName: string | null;
  feeder11Id: number | null;
  feeder11Name: string | null;
  substationId: number | null;
  substationName: string | null;
  feeder33Id: number | null;
  feeder33Name: string | null;
  transmissionStationId: number | null;
  transmissionStationName: string | null;
  latitude: number | null;
  longitude: number | null;
  outageType: OutageType;
}

export interface IOutageApiClient {
  getPastOutages(signal?: AbortSignal): Promise<OutageInfo[]>;
  getCurrentOutages(signal?: AbortSignal): Promise<OutageInfo[]>;
}
