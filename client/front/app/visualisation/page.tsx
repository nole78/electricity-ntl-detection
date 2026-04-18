"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { Graph } from "@/domain/models/Graph";
import type { VoltageLevel } from "@/domain/types/VoltageLevel";
import { TransmissionStationApiClient } from "@/api-client/TransmissionStationApiClient";

const PowerGridMap = dynamic(() => import("@/components/station-map"), {
  ssr: false,
  loading: () => (
    <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">
      Učitavanje mape...
    </div>
  )
});

const transmissionStationClient = new TransmissionStationApiClient("https://localhost:7057");

const legendItems: Array<{
  type: VoltageLevel;
  label: string;
  symbolClass: string;
}> = [
  {
    type: "TS",
    label: "Visokonaponske",
    symbolClass: "h-[18px] w-[18px] rounded-full bg-red-600 border-2 border-white ring-2 ring-red-900"
  },
  {
    type: "SS",
    label: "Srednjenaponske",
    symbolClass: "h-4 w-4 rounded-[4px] bg-blue-600 border-2 border-white ring-2 ring-blue-900"
  },
  {
    type: "DT",
    label: "Niskonaponske",
    symbolClass: "h-[14px] w-[14px] rotate-45 bg-green-600 border-2 border-white ring-2 ring-green-900"
  }
];

export default function PowerGridDashboard() {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const loadTransmissionStations = async () => {
      try {
        const transmissionNodes = await transmissionStationClient.getAllTransmissionStations(abortController.signal);
        setGraph({
          nodes: transmissionNodes,
          edges: []
        });
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Failed to load transmission stations", error);
          setGraph({ nodes: [], edges: [] });
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTransmissionStations();

    return () => abortController.abort();
  }, []);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Elektroenergetska Mreža
        </h1>
        <p className="text-gray-500 mt-2">
          Interaktivni prikaz visokonaponskih, srednjenaponskih i
          niskonaponskih podstanica
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-4 text-sm font-medium">
        {legendItems.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div className={item.symbolClass} />
            {item.label}
          </div>
        ))}
      </div>

      {loading || !graph ? (
        <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">
          Učitavanje podataka...
        </div>
      ) : (
        <PowerGridMap graph={graph} />
      )}
    </main>
  );
}