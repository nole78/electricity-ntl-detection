"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { Graph } from "@/domain/models/Graph";
import { TransmissionStationApiClient } from "@/api-client/TransmissionStationApiClient";

import { Header } from "@/components/header";
import { Legend } from "@/components/legend";
import { MapCard } from "@/components/map-card";

const PowerGridMap = dynamic(() => import("@/components/station-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center text-gray-400">
      Učitavanje mape...
    </div>
  )
});

const transmissionStationClient = new TransmissionStationApiClient("https://localhost:7057");

export default function PowerGridDashboard() {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const controller = new AbortController();
  let isMounted = true;

  const load = async () => {
    try {
      const nodes = await transmissionStationClient.getAllTransmissionStations(
        controller.signal
      );

      if (!isMounted) return;

      setGraph({ nodes, edges: [] });
    }catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") {
        return;
      }

      console.error(e);

      if (isMounted) {
        setGraph({ nodes: [], edges: [] });
      }
} finally {
      if (isMounted) setLoading(false);
    }
  };

  load();

  return () => {
    isMounted = false;
    controller.abort();
  };
}, []);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <Header />

      <div className="mb-4 flex items-center justify-between">
        <Legend />

        {/* future: filters */}
        <div className="text-sm text-gray-400">
          {graph?.nodes.length ?? 0} stanica
        </div>
      </div>

      <MapCard>
        {loading || !graph ? (
          <div className="h-[600px] flex items-center justify-center text-gray-400">
            Učitavanje podataka...
          </div>
        ) : (
          <PowerGridMap graph={graph} />
        )}
      </MapCard>
    </main>
  );
}