"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { Graph } from "@/domain/models/Graph";
import type { VoltageLevel } from "@/domain/types/VoltageLevel";
import { FeederVoltage } from "@/domain/types/FeederVoltage";

const PowerGridMap = dynamic(() => import("@/components/station-map"), {
  ssr: false,
  loading: () => (
    <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">
      Učitavanje mape...
    </div>
  )
});

// 🔥 DUMMY GRAPH
const dummyGraph: Graph = {
  nodes: [
    {
      id: "TS-1",
      name: "Beograd TS",
      type: "TS",
      latitude: 44.8125,
      longitude: 20.4612,
      position: { x: 0, y: 0 }
    },
    {
      id: "SS-1",
      name: "Zemun SS",
      type: "SS",
      latitude: 44.8562,
      longitude: 20.3941,
      position: { x: 0, y: 0 }
    },
    {
      id: "SS-2",
      name: "Novi Sad SS",
      type: "SS",
      latitude: 45.2541,
      longitude: 19.8452,
      position: { x: 0, y: 0 }
    },
    {
      id: "DT-1",
      name: "DT Dorćol",
      type: "DT",
      latitude: 44.8228,
      longitude: 20.4664,
      position: { x: 0, y: 0 }
    }
  ],

  edges: [
    {
      id: "E-1",
      from: "TS-1",
      to: "SS-1",
      voltage: "33KV" as FeederVoltage
    },
    {
      id: "E-2",
      from: "TS-1",
      to: "SS-2",
      voltage: "33KV" as FeederVoltage
    },
    {
      id: "E-3",
      from: "SS-1",
      to: "DT-1",
      voltage: "11KV" as FeederVoltage
    }
  ]
};

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
    const timer = setTimeout(() => {
      setGraph(dummyGraph);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
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