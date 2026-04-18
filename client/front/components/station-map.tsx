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


const dtIcon = L.icon({
  iconUrl: "/icons/DT.png",
  iconSize: [32, 32],       
  iconAnchor: [16, 32],      
  popupAnchor: [0, -32],    
});

const ssIcon = L.icon({
  iconUrl: "/icons/SS.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const tsIcon = L.icon({
  iconUrl: "/icons/TS.png",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

const createDtClusterIcon = (count: number) => createMarkerIcon(`
  <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" aria-label="DT cluster icon">
    <circle cx="21" cy="21" r="18" fill="#FFA02E" stroke="#468432" stroke-width="3"/>
    <text x="21" y="26" text-anchor="middle" font-size="13" font-weight="700" fill="#468432">${count}</text>
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
          
          {/* Layer 1: Transmission stations (Red) */}
          <LayersControl.Overlay checked name="Transmission Stations">
            <LayerGroup>
              {transmissionStations.map((station) => (
                <Marker key={`trans-${station.Id}`} position={[station.Latitude, station.Longitude]} icon={tsIcon}>
                  <Popup>
                    <span className="text-red-600 font-bold text-xs uppercase tracking-wider">Transmission Station</span><br/>
                    <strong className="text-lg">{station.Name}</strong><br />
                    Lat: {station.Latitude} | Lng: {station.Longitude}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 2: Substations (Blue) */}
          <LayersControl.Overlay checked name="Substations">
            <LayerGroup>
              {substations.map((station) => (
                <Marker key={`sub-${station.Id}`} position={[station.Latitude, station.Longitude]} icon={ssIcon}>
                  <Popup>
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Substation</span><br/>
                    <strong className="text-lg">{station.Name}</strong><br />
                    Lat: {station.Latitude} | Lng: {station.Longitude}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 3: Distribution transformer stations (Green) */}
          <LayersControl.Overlay checked name="Distribution Stations (DT)">
            <ZoomAwareDtLayer dtStations={dtStations} onDtSelect={onDtSelect} />
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}