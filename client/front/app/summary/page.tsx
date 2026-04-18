"use client";

import { useEffect, useMemo, useState } from "react";
import { SummaryApiClient } from "@/infrastructure/api-client/summary-api/SummaryApiClient";
import type {
  AnomalyClassification,
  FeederAnomalyResult,
  NtlSummaryResponse,
} from "@/infrastructure/api-client/summary-api/ISummaryApiClient";

function formatNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-US");
}

function getClassificationLabel(classification: AnomalyClassification): string {
  if (classification === 0 || classification === "Normal") {
    return "Normal";
  }

  if (classification === 1 || classification === "TheftSuspected") {
    return "Theft suspected";
  }

  return "Ghost/dead meters";
}

function getClassificationClass(classification: AnomalyClassification): string {
  if (classification === 0 || classification === "Normal") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (classification === 1 || classification === "TheftSuspected") {
    return "bg-rose-100 text-rose-800";
  }

  return "bg-amber-100 text-amber-800";
}

function OffendersTable({ rows }: { rows: FeederAnomalyResult[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        No offenders detected for the selected window.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Feeder</th>
            <th className="px-4 py-3 font-semibold">Classification</th>
            <th className="px-4 py-3 font-semibold">Anomaly %</th>
            <th className="px-4 py-3 font-semibold">Actual kWh</th>
            <th className="px-4 py-3 font-semibold">Expected kWh</th>
            <th className="px-4 py-3 font-semibold">Registered DT</th>
            <th className="px-4 py-3 font-semibold">Estimated active DT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {rows.map((row) => (
            <tr key={row.feeder11Id}>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{row.feeder11Name ?? `Feeder ${row.feeder11Id}`}</div>
                <div className="text-xs text-slate-500">ID: {row.feeder11Id}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getClassificationClass(row.classification)}`}>
                  {getClassificationLabel(row.classification)}
                </span>
              </td>
              <td className="px-4 py-3">{formatNumber(row.anomalyScorePercent)}%</td>
              <td className="px-4 py-3">{formatNumber(row.actualEnergyKwh)}</td>
              <td className="px-4 py-3">{formatNumber(row.expectedEnergyKwh)}</td>
              <td className="px-4 py-3">{formatNumber(row.registeredDtCount, 0)}</td>
              <td className="px-4 py-3">{formatNumber(row.estimatedActiveDtCount, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SummaryPage() {
  const summaryApiClient = useMemo(() => new SummaryApiClient(), []);
  const [summary, setSummary] = useState<NtlSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSummary() {
      setLoading(true);
      setError(null);

      try {
        const data = await summaryApiClient.getSummary({ signal: controller.signal });
        setSummary(data);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        const message = err instanceof Error ? err.message : "Failed to load summary data.";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      controller.abort();
    };
  }, [summaryApiClient]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 md:p-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">NTL Summary Dashboard</h1>
        <p className="text-sm text-slate-600">Live overview from /api/Summary endpoint.</p>
      </header>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          Loading summary metrics...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>
      )}

      {!loading && !error && summary && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Feeders analyzed</h2>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(summary.totalFeedersAnalyzed, 0)}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated NTL %</h2>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(summary.estimatedNtlPercent)}%</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivered energy</h2>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(summary.totalEnergyDeliveredKwh)} kWh</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated NTL energy</h2>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(summary.estimatedNtlEnergyKwh)} kWh</p>
            </article>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Normal</h2>
              <p className="mt-2 text-2xl font-bold text-emerald-900">{formatNumber(summary.normalCount, 0)}</p>
            </article>
            <article className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-rose-700">Theft suspected</h2>
              <p className="mt-2 text-2xl font-bold text-rose-900">{formatNumber(summary.theftSuspectedCount, 0)}</p>
            </article>
            <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-700">Ghost/dead</h2>
              <p className="mt-2 text-2xl font-bold text-amber-900">{formatNumber(summary.ghostOrDeadCount, 0)}</p>
            </article>
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Top Offenders</h2>
              <p className="text-sm text-slate-600">
                Window: {formatDate(summary.windowStart)} - {formatDate(summary.windowEnd)}
              </p>
            </div>
            <OffendersTable rows={summary.topOffenders} />
          </section>
        </>
      )}
    </main>
  );
}
