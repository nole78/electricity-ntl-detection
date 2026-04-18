"use client";

import { VoltageLevel } from "@/domain/types/VoltageLevel";

type Props = {
  node: {
    id: string;
    name: string;
    type: VoltageLevel;
    latitude: number;
    longitude: number;
  } | null;
  onClose: () => void;
};

export function StationDetailsPanel({ node, onClose }: Props) {
  if (!node) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-[320px] bg-white shadow-xl border-l border-gray-200 z-[1000] p-5 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Detalji stanice</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 text-sm">
        <div>
          <div className="text-gray-400">Naziv</div>
          <div className="font-medium">{node.name}</div>
        </div>

        <div>
          <div className="text-gray-400">Tip</div>
          <div>{node.type}</div>
        </div>

        <div>
          <div className="text-gray-400">Koordinate</div>
          <div>
            {node.latitude.toFixed(5)}, {node.longitude.toFixed(5)}
          </div>
        </div>
      </div>

      {/* future */}
      <div className="mt-auto text-xs text-gray-400 pt-4 border-t">
        ID: {node.id}
      </div>
    </div>
  );
}