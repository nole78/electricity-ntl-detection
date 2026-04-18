"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface Substation {
  Id: string | number;
  Name: string;
  Latitude: number;
  Longitude: number;
}

interface MapProps {
  substations: Substation[];
}

export default function SubstationMap({ substations }: MapProps) {
  // Default center point (e.g., center of Serbia: 44.0165, 21.0059)
  const defaultCenter: [number, number] = [44.0165, 21.0059];

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* OpenStreetMap Tile Layer (Free) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render a marker for each substation */}
        {substations.map((station) => (
          <Marker 
            key={station.Id} 
            position={[station.Latitude, station.Longitude]}
          >
            <Popup>
              <strong>{station.Name}</strong>
              <br />
              Lat: {station.Latitude} <br />
              Lng: {station.Longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}