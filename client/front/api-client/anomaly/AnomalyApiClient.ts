import { FeederAnomaly, IAnomalyApiClient } from "./IAnomalyApiClient";

export class AnomalyApiClient implements IAnomalyApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "") {
    this.baseUrl = baseUrl;
  }

  async getAnomalies(signal?: AbortSignal): Promise<FeederAnomaly[]> {
    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}/api/feeders/anomalies`, {
        method: "GET",
        signal,
        headers: {
          Accept: "application/json"
        }
      });
    } catch (error) {
      throw new Error(
        "Unable to reach anomalies API. Check if backend is running, CORS is enabled, and https://localhost:7061 certificate is trusted.",
        { cause: error }
      );
    }

    if (!response.ok) {
      const body = await response.text();
      const details = body.slice(0, 200).trim();
      const suffix = details.length > 0 ? ` - ${details}` : "";
      throw new Error(`Failed to load anomalies: ${response.status} ${response.statusText}${suffix}`);
    }

    const raw = (await response.json()) as unknown[];

    return raw
      .map((item, index) => this.mapAnomaly(item, index))
      .filter((item): item is FeederAnomaly => item !== null);
  }

  private mapAnomaly(item: unknown, index: number): FeederAnomaly | null {
    if (typeof item !== "object" || item === null) {
      return null;
    }

    const data = item as Record<string, unknown>;

    const feeder11Id = this.toNumber(data.feeder11Id, index + 1) ?? index + 1;
    const feeder11Name = this.toString(data.feeder11Name, `Feeder ${feeder11Id}`);
    const anomalyScorePercent = this.toNumber(data.anomalyScorePercent, 0) ?? 0;
    const classification = this.toClassification(data.classification);
    const centroidLatitude = this.toNumber(data.centroidLatitude);
    const centroidLongitude = this.toNumber(data.centroidLongitude);

    if (classification === null || centroidLatitude === null || centroidLongitude === null) {
      return null;
    }

    return {
      feeder11Id,
      feeder11Name,
      anomalyScorePercent,
      classification,
      centroidLatitude,
      centroidLongitude
    };
  }

  private toClassification(value: unknown): FeederAnomaly["classification"] | null {
    if (typeof value === "string") {
      if (
        value === "Normal" ||
        value === "TheftSuspected" ||
        value === "GhostOrDeadMeters"
      ) {
        return value;
      }
      return null;
    }

    if (typeof value === "number") {
      if (value === 0) return "Normal";
      if (value === 1) return "TheftSuspected";
      if (value === 2) return "GhostOrDeadMeters";
    }

    return null;
  }

  private toNumber(value: unknown, fallback: number | null = null): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return fallback;
  }

  private toString(value: unknown, fallback: string): string {
    return typeof value === "string" && value.trim().length > 0 ? value : fallback;
  }
}
