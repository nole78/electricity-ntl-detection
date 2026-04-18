"use client";

import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

export default function SubstationMap({ transmissionStations, substations, dtStations }: MapProps) {
  const defaultCenter: [number, number] = [44.0165, 21.0059]; // Center of Serbia

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
              {transmissionStations.map((station) => (
                <Marker key={`trans-${station.Id}`} position={[station.Latitude, station.Longitude]} icon={transmissionIcon}>
                  <Popup>
                    <span className="text-red-600 font-bold text-xs uppercase tracking-wider">Visokonaponska</span><br/>
                    <strong className="text-lg">{station.Name}</strong><br />
                    Lat: {station.Latitude} | Lng: {station.Longitude}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 2: Srednjenaponske (Blue) */}
          <LayersControl.Overlay checked name="Srednjenaponske podstanice">
            <LayerGroup>
              {substations.map((station) => (
                <Marker key={`sub-${station.Id}`} position={[station.Latitude, station.Longitude]} icon={substationIcon}>
                  <Popup>
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Srednjenaponska</span><br/>
                    <strong className="text-lg">{station.Name}</strong><br />
                    Lat: {station.Latitude} | Lng: {station.Longitude}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 3: Niskonaponske (Green) with extra details */}
          <LayersControl.Overlay checked name="Niskonaponske podstanice (Dt)">
            <LayerGroup>
              {dtStations.map((station) => (
                <Marker key={`dt-${station.Id}`} position={[station.Latitude, station.Longitude]} icon={dtIcon}>
                  <Popup>
                    <span className="text-green-600 font-bold text-xs uppercase tracking-wider">Niskonaponska</span><br/>
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