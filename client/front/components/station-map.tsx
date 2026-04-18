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

        <LayersControl position="topright">
          
          {/* Layer 1: Theft suspected anomalies (Red) */}
          <LayersControl.Overlay checked name="Theft Suspected">
            <LayerGroup>
              {transmissionStations.map((station) => (
                <Marker key={`trans-${station.Id}`} position={[station.Latitude, station.Longitude]} icon={transmissionIcon}>
                  <Popup>
                    <span className="text-red-600 font-bold text-xs uppercase tracking-wider">Theft Suspected</span><br/>
                    <strong className="text-lg">{station.Name}</strong><br />
                    Lat: {station.Latitude} | Lng: {station.Longitude}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 2: Ghost/dead meter anomalies (Blue) */}
          <LayersControl.Overlay checked name="Ghost or Dead Meters">
            <LayerGroup>
              {substations.map((station) => (
                <Marker key={`sub-${station.Id}`} position={[station.Latitude, station.Longitude]} icon={substationIcon}>
                  <Popup>
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Ghost or Dead Meters</span><br/>
                    <strong className="text-lg">{station.Name}</strong><br />
                    Lat: {station.Latitude} | Lng: {station.Longitude}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 3: Normal feeders (Green) with extra details */}
          <LayersControl.Overlay checked name="Normal Feeders">
            <LayerGroup>
              {dtStations.map((station) => (
                <Marker key={`dt-${station.Id}`} position={[station.Latitude, station.Longitude]} icon={dtIcon}>
                  <Popup>
                    <span className="text-green-600 font-bold text-xs uppercase tracking-wider">Normal</span><br/>
                    <strong className="text-lg">{station.Name}</strong><br />
                    <div className="mt-2 text-sm">
                      {station.NameplateRating && <div><strong>Snaga:</strong> {station.NameplateRating} kVA</div>}
                      {station.MeterId && <div><strong>Brojilo:</strong> {station.MeterId}</div>}
                      {station.Feeder11Id && <div><strong>SN vod:</strong> {station.Feeder11Id}</div>}
                      {station.Feeder33Id && <div><strong>VN vod:</strong> {station.Feeder33Id}</div>}
                      <div className="mt-1 text-gray-500 text-xs">Lat: {station.Latitude} | Lng: {station.Longitude}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}