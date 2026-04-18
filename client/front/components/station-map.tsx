"use client";

import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { groupDtStations } from '@/app/visualisation/helpers/groupDtStations';

// Base interface for Transmission and Substations
export interface BaseStation {
  Id: string | number;
  Name: string;
  Latitude: number;
  Longitude: number;
}

// Extended interface for Dt (Low voltage) which has extra fields
export interface DtStation extends BaseStation {
  MeterId?: string | number;
  Feeder11Id?: string | number;
  Feeder33Id?: string | number;
  NameplateRating?: number;
}

interface MapProps {
  transmissionStations: BaseStation[];
  substations: BaseStation[];
  dtStations: DtStation[];
  onDtSelect?: (station: DtStation) => void;
}

const createMarkerIcon = (svg: string) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: svg,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -30],
  });
};

const transmissionIcon = createMarkerIcon(`
  <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" aria-label="Transmission icon">
    <path d="M18 2C10.268 2 4 8.268 4 16c0 9.1 14 26 14 26s14-16.9 14-26C32 8.268 25.732 2 18 2z" fill="#B91C1C"/>
    <path d="M13 24h10M12 20h12M14 16h8M18 12v16M14 28h8" stroke="#FFF" stroke-width="1.7" stroke-linecap="round"/>
  </svg>
`);

const substationIcon = createMarkerIcon(`
  <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" aria-label="Substation icon">
    <path d="M18 2C10.268 2 4 8.268 4 16c0 9.1 14 26 14 26s14-16.9 14-26C32 8.268 25.732 2 18 2z" fill="#1D4ED8"/>
    <rect x="11" y="12" width="14" height="12" rx="2" fill="#FFF"/>
    <path d="M14 16h8M14 20h8M18 24v4" stroke="#1D4ED8" stroke-width="1.7" stroke-linecap="round"/>
  </svg>
`);

const dtIcon = createMarkerIcon(`
  <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" aria-label="DT icon">
    <path d="M18 2C10.268 2 4 8.268 4 16c0 9.1 14 26 14 26s14-16.9 14-26C32 8.268 25.732 2 18 2z" fill="#15803D"/>
    <circle cx="18" cy="17" r="6" fill="#FFF"/>
    <path d="M16.2 13.8L20 17h-2.2l1.9 3.2-3.8-3.2h2.2z" fill="#15803D"/>
  </svg>
`);

const createDtClusterIcon = (count: number) => createMarkerIcon(`
  <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" aria-label="DT cluster icon">
    <circle cx="21" cy="21" r="18" fill="#15803D" stroke="#ffffff" stroke-width="3"/>
    <text x="21" y="26" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">${count}</text>
  </svg>
`);

const getGroupedCount = (station: DtStation): number => {
  if (typeof station.MeterId !== 'string') {
    return 1;
  }

  const value = Number.parseInt(station.MeterId.split(' ')[0], 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
};

function ZoomAwareDtLayer({
  dtStations,
  onDtSelect,
}: {
  dtStations: DtStation[];
  onDtSelect?: (station: DtStation) => void;
}) {
  const [, setRevision] = useState(0);

  const map = useMapEvents({
    zoomend: () => {
      setRevision((value) => value + 1);
    },
  });

  const currentZoom = map.getZoom();
  const groupedStations = useMemo(() => groupDtStations(dtStations, currentZoom), [dtStations, currentZoom]);

  return (
    <LayerGroup>
      {groupedStations.map((station) => {
        const groupedCount = getGroupedCount(station);
        const icon = groupedCount > 1 ? createDtClusterIcon(groupedCount) : dtIcon;

        return (
          <Marker
            key={`dt-${station.Id}`}
            position={[station.Latitude, station.Longitude]}
            icon={icon}
            eventHandlers={{
              click: () => {
                onDtSelect?.(station);
              },
            }}
          />
        );
      })}
    </LayerGroup>
  );
}

export default function SubstationMap({ transmissionStations, substations, dtStations, onDtSelect }: MapProps) {
  const defaultCenter: [number, number] = [9.0765, 7.3986]; // Abuja, Nigeria

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapContainer center={defaultCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
            <ZoomAwareDtLayer dtStations={dtStations} onDtSelect={onDtSelect} />
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}