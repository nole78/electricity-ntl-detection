"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export interface OutageMapPoint {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  description?: string;
  detectedAt?: string | null;
  stationName?: string | null;
  feeder11Name?: string | null;
}

const outageIcon = L.divIcon({
  className: "custom-map-icon",
  html: `
    <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" aria-label="Outage marker icon">
      <path d="M18 2C10.268 2 4 8.268 4 16c0 9.1 14 26 14 26s14-16.9 14-26C32 8.268 25.732 2 18 2z" fill="#F97316"/>
      <circle cx="18" cy="17" r="6" fill="#ffffff"/>
      <path d="M18 12.8v8.4M18 24.2h.01" stroke="#EA580C" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  popupAnchor: [0, -30],
});

function RecenterMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 13, { animate: true });
  }, [map, latitude, longitude]);

  return null;
}

export default function OutageLocationMap({ point }: { point: OutageMapPoint }) {
  return (
    <div className="h-90 w-full overflow-hidden rounded-xl border border-emerald-700/60">
      <MapContainer center={[point.latitude, point.longitude]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap latitude={point.latitude} longitude={point.longitude} />

        <Marker position={[point.latitude, point.longitude]} icon={outageIcon}>
          <Popup>
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-600">Outage Location</div>
              <div className="text-sm font-bold">{point.title}</div>
              <div className="text-xs">Lat: {point.latitude.toFixed(5)} | Lng: {point.longitude.toFixed(5)}</div>
              {point.stationName ? <div className="text-xs">Station: {point.stationName}</div> : null}
              {point.feeder11Name ? <div className="text-xs">Feeder 11: {point.feeder11Name}</div> : null}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
