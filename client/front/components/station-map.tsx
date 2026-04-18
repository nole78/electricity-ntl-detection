"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Graph } from "@/domain/models/Graph";
import { FeederColorService } from "@/application/services/FeederColorService";
import { VoltageLevel } from "@/domain/types/VoltageLevel";

type Props = {
  graph: Graph;
};

export default function PowerGridMap({ graph }: Props) {

  // centar mape (fallback ako nema node-ova)
  const center: [number, number] =
    graph.nodes.length > 0
      ? [graph.nodes[0].latitude, graph.nodes[0].longitude]
      : [44.8, 20.4];

  const getNodeColor = (type: VoltageLevel) => {
    switch (type) {
      case "TS":
        return "red";
      case "SS":
        return "blue";
      case "DT":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={7}
      className="h-[600px] w-full rounded-lg border"
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

      {/* 📍 NODE-OVI (markeri) */}
      {graph.nodes.map(node => (
        <Marker
          key={node.id}
          position={[node.latitude, node.longitude]}
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