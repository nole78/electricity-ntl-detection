"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="text-white bg-foreground/80 max-w-7xl m-auto">

      {/* HERO */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl font-bold mb-6">
          NTL Detection System
        </h1>

        <p className="max-w-2xl text-lg text-header mb-6">
          A full-stack analytics platform for detecting non-technical losses 
          in electrical distribution networks across Nigeria.
        </p>

        <div className="flex gap-4">
          <Link
            href="/visualisation"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium"
          >
            Open Map
          </Link>

          <Link
            href="/summary"
            className="px-6 py-3 border border-background2 hover:bg-white/10 rounded-lg"
          >
            View Statistics
          </Link>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">
          The Problem
        </h2>

        <p className="text-background2 max-w-3xl mb-4">
          Nigerian distribution companies report losses between 15% and 30% 
          of delivered energy. Technical losses account for only 4–8%.
        </p>

        <p className="text-background2 max-w-3xl mb-4">
          The remaining losses are non-technical — caused by electricity theft, 
          faulty meters, and ghost connections.
        </p>

        <p className="text-background2 max-w-3xl">
          These losses represent billions of naira in lost revenue annually.
        </p>
      </section>

      {/* SOLUTION */}
      <section className="py-20 px-6 bg-background/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">
            Our Solution
          </h2>

          <p className="text-background2 max-w-3xl mb-4">
            We built a statistical detection system operating at the 11kV feeder level — 
            the last trusted measurement point in the grid.
          </p>

          <p className="text-background2 max-w-3xl mb-4">
            Using Z-score anomaly detection, physical loss modeling, and robust 
            statistical baselines, the system identifies feeders that require inspection.
          </p>

          <p className="text-background2 max-w-3xl">
            The output is actionable: engineers know exactly which feeders to inspect today.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 bg-white/5 rounded-xl">
            <h3 className="font-semibold mb-2">Data Processing</h3>
            <p className="text-background2 text-sm">
              3.19 million meter readings transformed into hourly consumption using SQL window functions.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl">
            <h3 className="font-semibold mb-2">Statistical Analysis</h3>
            <p className="text-background2 text-sm">
              Median-based normalization and Z-score detection isolate abnormal feeders.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl">
            <h3 className="font-semibold mb-2">Physical Modeling</h3>
            <p className="text-background2 text-sm">
              Technical losses computed using real electrical formulas and network geometry.
            </p>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-20 px-6 bg-background/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10">
            Results
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-black/30 rounded-xl">
              <div className="text-3xl font-bold text-orange-400">40.6 GWh</div>
              <div className="text-sm text-background2">Energy Delivered</div>
            </div>

            <div className="p-5 bg-black/30 rounded-xl">
              <div className="text-3xl font-bold text-green-400">5.2%</div>
              <div className="text-sm text-background2">Technical Losses</div>
            </div>

            <div className="p-5 bg-black/30 rounded-xl">
              <div className="text-3xl font-bold text-red-400">5.7%</div>
              <div className="text-sm text-background2">NTL Losses</div>
            </div>

            <div className="p-5 bg-black/30 rounded-xl">
              <div className="text-3xl font-bold text-blue-400">21</div>
              <div className="text-sm text-background2">Flagged Feeders</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10">
          Platform Features
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 rounded-xl">
            <h3 className="font-semibold mb-2">Interactive Map</h3>
            <p className="text-background2 text-sm">
              Visualize substations and feeders with real-time anomaly classification.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl">
            <h3 className="font-semibold mb-2">Statistical Dashboard</h3>
            <p className="text-background2 text-sm">
              Track losses, anomaly distribution, and feeder performance metrics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Explore the System
        </h2>

        <p className="text-background2 mb-6">
          Navigate through the platform and inspect anomalies directly.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/visulisation"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg"
          >
            Open Map
          </Link>

          <Link
            href="/summary"
            className="px-6 py-3 border border-background2 hover:bg-white/10 rounded-lg"
          >
            View Analytics
          </Link>
        </div>
      </section>

    </main>
  );
}