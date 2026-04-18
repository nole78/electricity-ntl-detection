import { StationNode } from "@/domain/models/StationNode";

export interface ITransmissionStationApiClient {
  getAllTransmissionStations(signal?: AbortSignal): Promise<StationNode[]>;
}
