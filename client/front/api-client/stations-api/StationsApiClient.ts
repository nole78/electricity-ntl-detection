import {
  type DistributionSubstationRecord,
  type GetDistributionSubstationsParams,
  type IStationsApiClient,
  type SubstationRecord,
  type TransmissionStationRecord,
} from "./IStationsApiClient";

export class StationsApiClient implements IStationsApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5601") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async getTransmissionStations(signal?: AbortSignal): Promise<TransmissionStationRecord[]> {
    return this.getJson<TransmissionStationRecord[]>("/api/registry/transmission-stations", signal);
  }

  async getSubstations(signal?: AbortSignal): Promise<SubstationRecord[]> {
    return this.getJson<SubstationRecord[]>("/api/registry/substations", signal);
  }

  async getDistributionSubstations(
    params?: GetDistributionSubstationsParams,
  ): Promise<DistributionSubstationRecord[]> {
    const query = new URLSearchParams();

    if (params?.feederIds && params.feederIds.length > 0) {
      query.set("feederIds", params.feederIds.join(","));
    }

    const querySuffix = query.toString() ? `?${query.toString()}` : "";

    return this.getJson<DistributionSubstationRecord[]>(
      `/api/registry/distribution-substations${querySuffix}`,
      params?.signal,
    );
  }

  private async getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registry API request failed (${response.status}): ${errorText || "Unknown error"}`);
    }

    return (await response.json()) as T;
  }
}
