"use client";

import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { TransmissionStation } from '@/domain/models/TransmissionStation';
import type { DtStation } from '@/domain/models/DtStation';
import type { StationNode } from '@/domain/models/StationNode';
import type { VoltageLevel } from '@/domain/types/VoltageLevel';

interface MapProps {
  transmissionStations: TransmissionStation[];
  substations: TransmissionStation[];
  dtStations: DtStation[];
}

const stationTypeLabel: Record<VoltageLevel, string> = {
  TS: 'Visokonaponska',
  SS: 'Srednjenaponska',
  DT: 'Niskonaponska'
};

const stationTypeColorClass: Record<VoltageLevel, string> = {
  TS: 'text-red-600',
  SS: 'text-blue-600',
  DT: 'text-green-600'
};

const toStationNode = (station: TransmissionStation | DtStation, type: VoltageLevel): StationNode => ({
  id: `${type}-${station.id}`,
  name: station.name,
  type,
  position: {
    x: station.longitude,
    y: station.latitude
  }
});

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

export default function SubstationMap({ transmissionStations, substations, dtStations }: MapProps) {
  const defaultCenter: [number, number] = [44.0165, 21.0059]; // Center of Serbia
  const transmissionNodes = transmissionStations.map((station) => toStationNode(station, 'TS'));
  const substationNodes = substations.map((station) => toStationNode(station, 'SS'));
  const dtNodePairs = dtStations.map((station) => ({
    station,
    node: toStationNode(station, 'DT')
  }));

  return (
    <div style={{ height: '600px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <MapContainer center={defaultCenter} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topright">
          
          {/* Layer 1: Visokonaponske (Red) */}
          <LayersControl.Overlay checked name="Visokonaponske podstanice">
            <LayerGroup>
              {transmissionNodes.map((node) => (
                <Marker key={node.id} position={[node.position.y, node.position.x]} icon={transmissionIcon}>
                  <Popup>
                    <span className={`${stationTypeColorClass[node.type]} font-bold text-xs uppercase tracking-wider`}>{stationTypeLabel[node.type]}</span><br/>
                    <strong className="text-lg">{node.name}</strong><br />
                    Lat: {node.position.y} | Lng: {node.position.x}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 2: Srednjenaponske (Blue) */}
          <LayersControl.Overlay checked name="Srednjenaponske podstanice">
            <LayerGroup>
              {substationNodes.map((node) => (
                <Marker key={node.id} position={[node.position.y, node.position.x]} icon={substationIcon}>
                  <Popup>
                    <span className={`${stationTypeColorClass[node.type]} font-bold text-xs uppercase tracking-wider`}>{stationTypeLabel[node.type]}</span><br/>
                    <strong className="text-lg">{node.name}</strong><br />
                    Lat: {node.position.y} | Lng: {node.position.x}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 3: Niskonaponske (Green) with extra details */}
          <LayersControl.Overlay checked name="Niskonaponske podstanice (Dt)">
            <LayerGroup>
              {dtNodePairs.map(({ station, node }) => (
                <Marker key={node.id} position={[node.position.y, node.position.x]} icon={dtIcon}>
                  <Popup>
                    <span className={`${stationTypeColorClass[node.type]} font-bold text-xs uppercase tracking-wider`}>{stationTypeLabel[node.type]}</span><br/>
                    <strong className="text-lg">{node.name}</strong><br />
                    <div className="mt-2 text-sm">
                      {station.nameplateRating != null && <div><strong>Snaga:</strong> {station.nameplateRating} kVA</div>}
                      {station.meterId != null && <div><strong>Brojilo:</strong> {station.meterId}</div>}
                      {station.feeder11Id != null && <div><strong>SN vod:</strong> {station.feeder11Id}</div>}
                      {station.feeder33Id != null && <div><strong>VN vod:</strong> {station.feeder33Id}</div>}
                      <div className="mt-1 text-gray-500 text-xs">Lat: {node.position.y} | Lng: {node.position.x}</div>
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