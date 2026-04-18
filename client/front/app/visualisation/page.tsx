"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { TransmissionStation } from '@/domain/models/TransmissionStation';
import type { DtStation } from '@/domain/models/DtStation';

const PowerGridMap = dynamic(() => import('@/components/station-map'), {
  ssr: false,
  loading: () => <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">Učitavanje mape...</div>
});

const dummyTransmissionStations: TransmissionStation[] = [
  { id: 1, name: 'Beograd 400/220 kV', latitude: 44.8125, longitude: 20.4612 },
  { id: 2, name: 'Novi Sad 220/110 kV', latitude: 45.2541, longitude: 19.8452 },
  { id: 3, name: 'Niš 220/110 kV', latitude: 43.3268, longitude: 21.9069 }
];

const dummySubstations: TransmissionStation[] = [
  { id: 101, name: 'Zemun 110/35 kV', latitude: 44.8562, longitude: 20.3941 },
  { id: 102, name: 'Kragujevac 110/35 kV', latitude: 44.0158, longitude: 20.9189 },
  { id: 103, name: 'Subotica 110/35 kV', latitude: 46.1032, longitude: 19.6647 }
];

const dummyDtStations: DtStation[] = [
  {
    id: 201,
    name: 'DT Dorćol 1',
    latitude: 44.8228,
    longitude: 20.4664,
    meterId: 'MTR-1001',
    feeder11Id: 'F11-BG-07',
    feeder33Id: 'F33-BG-02',
    nameplateRating: 630
  },
  {
    id: 202,
    name: 'DT Liman 3',
    latitude: 45.2395,
    longitude: 19.8456,
    meterId: 'MTR-2008',
    feeder11Id: 'F11-NS-03',
    feeder33Id: 'F33-NS-01',
    nameplateRating: 400
  },
  {
    id: 203,
    name: 'DT Pantelej',
    latitude: 43.3312,
    longitude: 21.9302,
    meterId: 'MTR-3012',
    feeder11Id: 'F11-NI-05',
    feeder33Id: 'F33-NI-02',
    nameplateRating: 250
  }
];

export default function PowerGridDashboard() {
  const [transmissionStations, setTransmissionStations] = useState<TransmissionStation[]>([]);
  const [substations, setSubstations] = useState<TransmissionStation[]>([]);
  const [dtStations, setDtStations] = useState<DtStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransmissionStations(dummyTransmissionStations);
      setSubstations(dummySubstations);
      setDtStations(dummyDtStations);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Elektroenergetska Mreža</h1>
        <p className="text-gray-500 mt-2">Interaktivni prikaz visokonaponskih, srednjenaponskih i niskonaponskih podstanica</p>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-4 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600"></div> Visokonaponske
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600"></div> Srednjenaponske
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-600"></div> Niskonaponske
        </div>
      </div>

      {loading ? (
        <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">
          Učitavanje podataka stanica...
        </div>
      ) : (
        <PowerGridMap
          transmissionStations={transmissionStations}
          substations={substations}
          dtStations={dtStations}
        />
      )}
    </main>
  );
}