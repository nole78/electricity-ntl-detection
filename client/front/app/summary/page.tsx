"use client";

import { useEffect, useMemo, useState } from "react";
import { SummaryApiClient } from "@/api-client/summary-api/SummaryApiClient";
import type {
  AnomalyClassification,
  FeederAnomalyResult,
  NtlSummaryResponse,
} from "@/api-client/summary-api/ISummaryApiClient";

function formatNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-US");
}

function getClassificationLabel(classification: AnomalyClassification): string {
  if (classification === 0 || classification === "Normal") return "Normal";
  if (classification === 1 || classification === "TheftSuspected") return "Theft suspected";
  return "Ghost/dead";
}

function getClassificationClass(classification: AnomalyClassification): string {
  if (classification === 0 || classification === "Normal") {
    return "bg-green-500/15 text-green-300 border border-green-500/30";
  }
  if (classification === 1 || classification === "TheftSuspected") {
    return "bg-red-500/15 text-red-300 border border-red-500/30";
  }
  return "bg-amber-500/15 text-amber-300 border border-amber-500/30";
}

function OffendersTable({ rows }: { rows: FeederAnomalyResult[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/50 p-6 text-sm text-emerald-200/70">
        No offenders detected.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-700/40 bg-emerald-900/60 backdrop-blur">
      <table className="min-w-full text-sm text-emerald-100">
        <thead className="text-left text-xs uppercase tracking-wide text-emerald-300/70">
          <tr>
            <th className="px-4 py-3">Feeder</th>
            <th className="px-4 py-3">Classification</th>
            <th className="px-4 py-3">Anomaly %</th>
            <th className="px-4 py-3">Actual</th>
            <th className="px-4 py-3">Expected</th>
            <th className="px-4 py-3">DT Count</th>
            <th className="px-4 py-3">Active DT</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-emerald-800/40">
          {rows.map((row) => (
            <tr key={row.feeder11Id} className="hover:bg-emerald-800/30 transition">
              <td className="px-4 py-3">
                <div className="font-semibold text-white">{row.feeder11Name ?? `Feeder ${row.feeder11Id}`}</div>
                <div className="text-xs text-emerald-400/70">ID: {row.feeder11Id}</div>
              </td>

              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getClassificationClass(row.classification)}`}>
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
      try {
        const data = await summaryApiClient.getSummary({ signal: controller.signal });
        setSummary(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSummary();
    return () => controller.abort();
  }, [summaryApiClient]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-emerald-950 text-emerald-50">
      {/*BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 pt-10 md:px-10">
        {/* HEADER */}
      <header className="rounded-3xl border border-emerald-700/60 bg-emerald-900/70 p-7 shadow-2xl backdrop-blur md:p-10 mb-8">        <div className="inline-flex rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
          Grid Analytics
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          NTL Analytics Dashboard
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-100/80 md:text-base">
          Real-time overview of non-technical losses, feeder performance, and anomaly detection results across the distribution network.
        </p>
      </header>

        {loading && (
          <div className="rounded-2xl bg-emerald-900/50 p-6 text-emerald-200">
            Loading summary...
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-500/20 p-6 text-red-300">
            {error}
          </div>
        )}

        {summary && (
          <>
            {/*KPI CARDS */}
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card">
                <div className="text-orange-300 text-2xl font-bold">
                  {formatNumber(summary.totalFeedersAnalyzed, 0)}
                </div>
                <p className="text-sm text-emerald-200/70">Feeders analyzed</p>
              </div>

              <div className="card">
                <div className="text-green-300 text-2xl font-bold">
                  {formatNumber(summary.estimatedNtlPercent)}%
                </div>
                <p className="text-sm text-emerald-200/70">Estimated NTL</p>
              </div>

              <div className="card">
                <div className="text-blue-300 text-2xl font-bold">
                  {formatNumber(summary.totalEnergyDeliveredKwh)} kWh
                </div>
                <p className="text-sm text-emerald-200/70">Energy Delivered</p>
              </div>

              <div className="card">
                <div className="text-red-300 text-2xl font-bold">
                  {formatNumber(summary.estimatedNtlEnergyKwh)} kWh
                </div>
                <p className="text-sm text-emerald-200/70">NTL Energy</p>
              </div>
            </section>

            {/*DISTRIBUTION */}
            <section className="mt-10 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-5 text-center">
                <div className="text-2xl font-bold text-green-300">{summary.normalCount}</div>
                <p className="text-sm text-green-200/70">Normal</p>
              </div>

              <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5 text-center">
                <div className="text-2xl font-bold text-red-300">{summary.theftSuspectedCount}</div>
                <p className="text-sm text-red-200/70">Theft</p>
              </div>

              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 text-center">
                <div className="text-2xl font-bold text-amber-300">{summary.ghostOrDeadCount}</div>
                <p className="text-sm text-amber-200/70">Ghost/Dead</p>
              </div>
            </section>

            {/*TABLE */}
            <section className="mt-12 space-y-3">
              <h2 className="text-2xl font-semibold text-white">Top Offenders</h2>
              <p className="text-sm text-emerald-200/60">
                {formatDate(summary.windowStart)} → {formatDate(summary.windowEnd)}
              </p>

              <OffendersTable rows={summary.topOffenders} />
            </section>
          </>
        )}
      </div>

      {/* reusable card class */}
      <style jsx>{`
        .card {
          background: rgba(6, 78, 59, 0.6);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }
      `}</style>
    </main>
  );
}