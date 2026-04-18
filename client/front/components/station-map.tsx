"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Graph } from "@/domain/models/Graph";
import { FeederColorService } from "@/application/services/FeederColorService";
import { VoltageLevel } from "@/domain/types/VoltageLevel";

type Props = {
  graph: Graph;
  onNodeClick?: (nodeId: string) => void;
};

// Next.js does not automatically resolve Leaflet's default marker images.
// Without these URLs markers are present but invisible.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const voltageLevelIcons: Record<VoltageLevel, L.DivIcon> = {
  TS: L.divIcon({
    className: "",
    html: '<div style="width:18px;height:18px;border-radius:9999px;background:#dc2626;border:2px solid #ffffff;box-shadow:0 0 0 2px #7f1d1d;"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10]
  }),
  SS: L.divIcon({
    className: "",
    html: '<div style="width:16px;height:16px;border-radius:4px;background:#2563eb;border:2px solid #ffffff;box-shadow:0 0 0 2px #1e3a8a;"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
  }),
  DT: L.divIcon({
    className: "",
    html: '<div style="width:14px;height:14px;background:#16a34a;border:2px solid #ffffff;box-shadow:0 0 0 2px #14532d;transform:rotate(45deg);"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10]
  })
};

export default function PowerGridMap({ graph, onNodeClick }: Props) {

  // centar mape (fallback ako nema node-ova)
  const center: [number, number] =
    graph.nodes.length > 0
      ? [graph.nodes[0].latitude, graph.nodes[0].longitude]
      : [44.8, 20.4];

  const getNodeIcon = (type: VoltageLevel) => voltageLevelIcons[type];

  return (
    <MapContainer
      center={center}
      zoom={7}
      className="h-[600px] w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* EDGEs */}
      {graph.edges.map(edge => {
        const from = graph.nodes.find(n => n.id === edge.from);
        const to = graph.nodes.find(n => n.id === edge.to);

        if (!from || !to) return null;

        return (
          <Polyline
            key={edge.id}
            positions={[
              [from.latitude, from.longitude],
              [to.latitude, to.longitude]
            ]}
            pathOptions={{
              color: FeederColorService.getColor(edge.voltage),
              weight: 3
            }}
          />
        );
      })}

      {/* NODES */}
      {graph.nodes.map(node => (
        <Marker
          key={node.id}
          position={[node.latitude, node.longitude]}
          icon={getNodeIcon(node.type)}
          eventHandlers={{
            click: () => onNodeClick?.(node.id)
          }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-bold">{node.name}</div>
              <div>Tip: {node.type}</div>
              <div>
                Lokacija: {node.latitude.toFixed(4)},{" "}
                {node.longitude.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}