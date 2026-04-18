"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { OutageApiClient } from "@/api-client/outeage-api-client/OutageApiClient";
import type { OutageInfo, OutageType } from "@/api-client/outeage-api-client/IOutageApiClient";
import type { OutageMapPoint } from "./components/outage-location-map";

const OutageLocationMap = dynamic(() => import("./components/outage-location-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-90 w-full animate-pulse items-center justify-center rounded-xl border border-emerald-700/60 bg-emerald-950/60 text-emerald-200/80">
      Loading map...
    </div>
  )
});

type OutageState = {
  current: OutageInfo[];
  past: OutageInfo[];
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Unknown";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleString("en-US");
}

function formatStationName(outage: OutageInfo): string {
  return outage.substationName ?? outage.transmissionStationName ?? "Unknown";
}

function getOutageTypeLabel(outageType: OutageType): string {
  if (outageType === "TelemetryGap") return "Telemetry Gap";
  if (outageType === "ActiveTelemetryOutage") return "Active Telemetry Outage";
  if (outageType === "ZeroVoltage") return "Zero Voltage";
  return "No Telemetry";
}

function getOutageTypeClass(outageType: OutageType): string {
  if (outageType === "TelemetryGap") {
    return "border-amber-400/40 bg-amber-400/15 text-amber-200";
  }

  if (outageType === "ActiveTelemetryOutage") {
    return "border-rose-400/40 bg-rose-400/15 text-rose-200";
  }

  if (outageType === "ZeroVoltage") {
    return "border-blue-400/40 bg-blue-400/15 text-blue-200";
  }

  return "border-orange-400/40 bg-orange-400/15 text-orange-200";
}

function createOutageMapPoint(row: OutageInfo, id: string, title: string): OutageMapPoint | null {
  if (row.latitude == null || row.longitude == null) {
    return null;
  }

  return {
    id,
    title,
    latitude: row.latitude,
    longitude: row.longitude,
    description: row.description,
    detectedAt: row.detectedAt,
    stationName: formatStationName(row),
    feeder11Name: row.feeder11Name,
  };
}

function OutageTable({
  title,
  data,
  selectedMapPointId,
  onShowOnMap,
}: {
  title: string;
  data: OutageInfo[];
  selectedMapPointId: string | null;
  onShowOnMap: (point: OutageMapPoint) => void;
}) {
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const [currentPage, setCurrentPage] = useState(1);
  const visiblePage = Math.min(currentPage, totalPages);
  const startIndex = (visiblePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageRows = data.slice(startIndex, endIndex);

  const getRowKey = (row: OutageInfo, absoluteIndex: number): string => {
    return `${title}-${row.meterId}-${row.detectedAt ?? "none"}-${row.outageType}-${absoluteIndex}`;
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <section className="rounded-2xl border border-emerald-700/60 bg-emerald-900/60 p-5 shadow-xl backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <span className="rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange-300">
          {data.length} records
        </span>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-emerald-700/70 bg-emerald-950/50 p-4 text-sm text-emerald-100/80">
          No outages found.
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between text-xs text-emerald-200/90">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
            </span>
            <span>
              Page {visiblePage} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-emerald-700/60">
            <table className="min-w-full divide-y divide-emerald-700/70 text-sm text-emerald-100/90">
            <thead className="bg-emerald-950/60 text-left text-xs uppercase tracking-wide text-emerald-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Detected At</th>
                <th className="px-4 py-3 font-semibold">Meter</th>
                <th className="px-4 py-3 font-semibold">Feeder 11</th>
                <th className="px-4 py-3 font-semibold">Station</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Map</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800/70">
              {pageRows.map((row, index) => {
                const rowId = getRowKey(row, startIndex + index);
                const mapPoint = createOutageMapPoint(row, rowId, `${title} • Meter #${row.meterId}`);

                return (
                <tr key={rowId} className="bg-emerald-900/30 align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getOutageTypeClass(row.outageType)}`}
                    >
                      {getOutageTypeLabel(row.outageType)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(row.detectedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">#{row.meterId}</div>
                    <div className="text-xs text-emerald-200/80">DT: {row.dtName ?? "N/A"}</div>
                  </td>
                  <td className="px-4 py-3">{row.feeder11Name ?? "N/A"}</td>
                  <td className="px-4 py-3">{formatStationName(row)}</td>
                  <td className="px-4 py-3 text-emerald-100/80">{row.description}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {mapPoint ? (
                      <button
                        type="button"
                        onClick={() => onShowOnMap(mapPoint)}
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition ${
                          selectedMapPointId === rowId
                            ? "border-orange-300 bg-orange-500/35 text-white"
                            : "border-orange-400/50 bg-orange-500/15 text-orange-100 hover:bg-orange-500/25"
                        }`}
                      >
                        Show on map
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-300/70">No coordinates</span>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={visiblePage <= 1}
              className="rounded-lg border border-emerald-400/50 bg-emerald-800/40 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-700/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={visiblePage >= totalPages}
              className="rounded-lg border border-orange-400/60 bg-orange-500/15 px-3 py-1.5 text-xs font-semibold text-orange-100 transition hover:bg-orange-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default function OutagesPage() {
  const outageApiClient = useMemo(() => new OutageApiClient(), []);
  const [outages, setOutages] = useState<OutageState>({ current: [], past: [] });
  const [selectedMapPoint, setSelectedMapPoint] = useState<OutageMapPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapSectionRef = useRef<HTMLElement | null>(null);

  const handleShowOnMap = (point: OutageMapPoint) => {
    setSelectedMapPoint(point);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadOutages() {
      setLoading(true);
      setError(null);

      try {
        const [past, current] = await Promise.all([
          outageApiClient.getPastOutages(controller.signal),
          outageApiClient.getCurrentOutages(controller.signal),
        ]);

        setOutages({ current, past });

        const defaultMapRow = [...current, ...past].find(
          (row) => row.latitude != null && row.longitude != null,
        );

        if (!defaultMapRow) {
          setSelectedMapPoint(null);
          return;
        }

        const defaultMapPoint = createOutageMapPoint(
          defaultMapRow,
          `default-${defaultMapRow.meterId}-${defaultMapRow.detectedAt ?? "none"}`,
          `Outage • Meter #${defaultMapRow.meterId}`,
        );

        setSelectedMapPoint(defaultMapPoint);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        const message = err instanceof Error ? err.message : "Failed to load outage data.";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadOutages();

    return () => {
      controller.abort();
    };
  }, [outageApiClient]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-emerald-950 text-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-green-500/25 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute left-1/4 top-80 h-80 w-80 rounded-full bg-green-300/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-lime-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 pt-10 md:px-10">
        <header className="rounded-3xl border border-emerald-700/60 bg-emerald-900/70 p-7 shadow-2xl backdrop-blur md:p-10">
          <div className="inline-flex rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
            Grid Outage Monitor
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">Outage History and Live Outages</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-100/80 md:text-base">
            This page combines data from both outage routes: <span className="font-semibold text-orange-200">GetAllPast</span> and <span className="font-semibold text-orange-200">GetAllCurrent</span>.
          </p>
        </header>

        {loading && (
          <div className="mt-6 rounded-2xl border border-emerald-700/60 bg-emerald-900/60 p-5 text-emerald-100/90">
            Loading outage data...
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-rose-400/40 bg-rose-500/15 p-5 text-rose-100">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-orange-500/30 bg-emerald-900/65 p-5">
                <div className="text-sm uppercase tracking-wide text-emerald-100/80">Current outages</div>
                <div className="mt-2 text-3xl font-bold text-orange-300">{outages.current.length}</div>
              </article>
              <article className="rounded-2xl border border-blue-500/30 bg-emerald-900/65 p-5">
                <div className="text-sm uppercase tracking-wide text-emerald-100/80">Past outages</div>
                <div className="mt-2 text-3xl font-bold text-blue-300">{outages.past.length}</div>
              </article>
            </section>

            <section ref={mapSectionRef} className="mt-6 rounded-2xl border border-emerald-700/60 bg-emerald-900/60 p-5 shadow-xl backdrop-blur">
              <h2 className="text-xl font-semibold text-white">Outage Location Map</h2>
              <p className="mt-1 text-sm text-emerald-100/80">
                Click <span className="font-semibold text-orange-200">Show on map</span> in any row to focus that outage location.
              </p>

              {selectedMapPoint ? (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-emerald-700/70 bg-emerald-950/50 p-3 text-sm text-emerald-100/85">
                    <div className="font-semibold text-white">{selectedMapPoint.title}</div>
                    <div className="mt-1">Detected: {formatDate(selectedMapPoint.detectedAt ?? null)}</div>
                    <div>Station: {selectedMapPoint.stationName ?? "Unknown"}</div>
                    <div>Feeder 11: {selectedMapPoint.feeder11Name ?? "N/A"}</div>
                  </div>
                  <OutageLocationMap point={selectedMapPoint} />
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-emerald-700/70 bg-emerald-950/50 p-4 text-sm text-emerald-100/80">
                  No outage with coordinates is available to show on the map.
                </div>
              )}
            </section>

            <section className="mt-6 grid gap-6">
              <OutageTable
                title="Current Outages"
                data={outages.current}
                selectedMapPointId={selectedMapPoint?.id ?? null}
                onShowOnMap={handleShowOnMap}
              />
              <OutageTable
                title="Past Outages"
                data={outages.past}
                selectedMapPointId={selectedMapPoint?.id ?? null}
                onShowOnMap={handleShowOnMap}
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
