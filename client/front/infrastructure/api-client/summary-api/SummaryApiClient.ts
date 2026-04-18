import {
  type GetSummaryParams,
  type ISummaryApiClient,
  type NtlSummaryResponse,
} from "./ISummaryApiClient";

export class SummaryApiClient implements ISummaryApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5601") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async getSummary(params?: GetSummaryParams): Promise<NtlSummaryResponse> {
    const query = new URLSearchParams();

    if (params?.from) {
      query.set("from", params.from);
    }

    if (params?.to) {
      query.set("to", params.to);
    }

    const querySuffix = query.toString() ? `?${query.toString()}` : "";
    const response = await fetch(`${this.baseUrl}/api/Summary${querySuffix}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: params?.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Summary API request failed (${response.status}): ${errorText || "Unknown error"}`);
    }

    return (await response.json()) as NtlSummaryResponse;
  }
}
