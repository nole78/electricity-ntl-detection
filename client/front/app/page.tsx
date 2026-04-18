"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-emerald-950 text-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-green-500/25 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute left-1/4 top-80 h-80 w-80 rounded-full bg-green-300/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-lime-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-12 md:px-10">
        <section className="rounded-3xl border border-emerald-700/60 bg-emerald-900/70 p-8 shadow-2xl backdrop-blur md:p-12">
          <div className="inline-flex rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
            Grid Intelligence Platform
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            NTL Detection System for Faster Feeder Action
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-emerald-100/80 md:text-lg">
            A full-stack analytics platform for detecting non-technical losses in electrical distribution networks across Nigeria.
            Engineers get a ranked list of feeders, mapped context, and a clear inspection starting point.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/visualisation"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-950/40 transition hover:bg-orange-400"
            >
              Open Map
            </Link>
            <Link
              href="/summary"
              className="rounded-xl border border-emerald-400/60 bg-emerald-800/40 px-6 py-3 font-semibold text-emerald-50 transition hover:border-blue-400/60 hover:bg-blue-500/10"
            >
              View Summary
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-orange-500/30 bg-emerald-900/65 p-5">
            <div className="text-2xl font-bold text-orange-300">40.6 GWh</div>
            <p className="mt-1 text-sm text-emerald-100/80">Energy Delivered</p>
          </article>
          <article className="rounded-2xl border border-green-500/30 bg-emerald-900/65 p-5">
            <div className="text-2xl font-bold text-green-300">5.2%</div>
            <p className="mt-1 text-sm text-emerald-100/80">Technical Losses</p>
          </article>
          <article className="rounded-2xl border border-red-500/30 bg-emerald-900/65 p-5">
            <div className="text-2xl font-bold text-red-300">5.7%</div>
            <p className="mt-1 text-sm text-emerald-100/80">NTL Losses</p>
          </article>
          <article className="rounded-2xl border border-blue-500/30 bg-emerald-900/65 p-5">
            <div className="text-2xl font-bold text-blue-300">21</div>
            <p className="mt-1 text-sm text-emerald-100/80">Flagged Feeders</p>
          </article>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-700/60 bg-emerald-900/65 p-6">
            <h2 className="text-2xl font-semibold text-white">The Problem</h2>
            <p className="mt-4 leading-relaxed text-emerald-100/80">
              Nigerian distribution companies report losses between 15% and 30% of delivered energy. Technical losses account
              for only 4–8%, while the rest are non-technical losses driven by theft, faulty metering, and ghost connections.
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-700/60 bg-emerald-900/65 p-6">
            <h2 className="text-2xl font-semibold text-white">Our Approach</h2>
            <p className="mt-4 leading-relaxed text-emerald-100/80">
              We analyze feeder-level behavior using robust baselines, anomaly scoring, and physical-loss context. The output is
              operationally focused: who to inspect, where to inspect, and why.
            </p>
          </article>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">How It Works</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-red-500/25 bg-emerald-900/65 p-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20 text-sm font-bold text-red-300">1</div>
              <h3 className="mt-3 font-semibold text-white">Data Processing</h3>
              <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
                3.19 million readings are transformed into consistent hourly consumption snapshots.
              </p>
            </article>
            <article className="rounded-2xl border border-blue-500/25 bg-emerald-900/65 p-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 text-sm font-bold text-blue-300">2</div>
              <h3 className="mt-3 font-semibold text-white">Statistical Detection</h3>
              <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
                Median-based normalization and anomaly scoring isolate feeders with unusual behavior.
              </p>
            </article>
            <article className="rounded-2xl border border-green-500/25 bg-emerald-900/65 p-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20 text-sm font-bold text-green-300">3</div>
              <h3 className="mt-3 font-semibold text-white">Actionable Output</h3>
              <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
                Teams receive a prioritized, map-ready list of feeders requiring field inspection.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-emerald-700/70 bg-emerald-900/70 p-8 text-center md:p-10">
          <h2 className="text-3xl font-semibold text-white">Start Exploring</h2>
          <p className="mx-auto mt-3 max-w-2xl text-emerald-100/80">
            Jump into the live map to inspect stations and feeder clusters, or open summary analytics for the latest KPIs.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/visualisation" className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-400">
              Explore Visualisation
            </Link>
            <Link href="/summary" className="rounded-xl border border-blue-400/50 px-6 py-3 font-semibold text-blue-200 transition hover:bg-blue-500/10">
              Open Analytics
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}