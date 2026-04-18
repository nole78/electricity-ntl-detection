export interface TransmissionStationRecord {
  id: number;
  name: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface SubstationRecord {
  id: number;
  name: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface DistributionSubstationRecord {
  id: number;
  name: string | null;
  meterId: number | null;
  feeder11Id: number | null;
  feeder33Id: number | null;
  nameplateRating: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface GetDistributionSubstationsParams {
  feederIds?: number[];
  signal?: AbortSignal;
}

export interface IStationsApiClient {
  getTransmissionStations(signal?: AbortSignal): Promise<TransmissionStationRecord[]>;
  getSubstations(signal?: AbortSignal): Promise<SubstationRecord[]>;
  getDistributionSubstations(
    params?: GetDistributionSubstationsParams,
  ): Promise<DistributionSubstationRecord[]>;
}
