import { StationNode } from "@/domain/models/StationNode";
import { ITransmissionStationApiClient } from "./ITransmissionStationApiClient";

export class TransmissionStationApiClient implements ITransmissionStationApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "") {
    this.baseUrl = baseUrl;
  }

  async getAllTransmissionStations(signal?: AbortSignal): Promise<StationNode[]> {
    const response = await fetch(`https://localhost:7061/api/transmission-stations`, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load transmission stations: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as Array<{
      name: string | null;
      latitude: number | null;
      longitude: number | null;
    }>;

    return data
      .filter((item): item is { name: string; latitude: number; longitude: number } => (
        item.latitude != null && item.longitude != null && item.name != null
      ))
      .map((item, index) => ({
        // Backend DTO does not expose Id, so we generate a stable list-local ID.
        id: `TS-${index + 1}`,
        name: item.name,
        type: "TS",
        latitude: item.latitude,
        longitude: item.longitude
      }));
  }
}
