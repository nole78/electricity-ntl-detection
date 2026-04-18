"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type  {BaseStation} from '@/components/station-map';
import type {DtStation} from '@/components/station-map';

const PowerGridMap = dynamic(() => import('@/components/station-map'), {
  ssr: false,
  loading: () => <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">Učitavanje mape...</div>
});

const dummyTransmissionStations: BaseStation[] = [
  { Id: 1, Name: 'Beograd 400/220 kV', Latitude: 44.8125, Longitude: 20.4612 },
  { Id: 2, Name: 'Novi Sad 220/110 kV', Latitude: 45.2541, Longitude: 19.8452 },
  { Id: 3, Name: 'Niš 220/110 kV', Latitude: 43.3268, Longitude: 21.9069 }
];

const dummySubstations: BaseStation[] = [
  { Id: 101, Name: 'Zemun 110/35 kV', Latitude: 44.8562, Longitude: 20.3941 },
  { Id: 102, Name: 'Kragujevac 110/35 kV', Latitude: 44.0158, Longitude: 20.9189 },
  { Id: 103, Name: 'Subotica 110/35 kV', Latitude: 46.1032, Longitude: 19.6647 }
];

const dummyDtStations: DtStation[] = [
  {
    Id: 201,
    Name: 'DT Dorćol 1',
    Latitude: 44.8228,
    Longitude: 20.4664,
    MeterId: 'MTR-1001',
    Feeder11Id: 'F11-BG-07',
    Feeder33Id: 'F33-BG-02',
    NameplateRating: 630
  },
  {
    Id: 202,
    Name: 'DT Liman 3',
    Latitude: 45.2395,
    Longitude: 19.8456,
    MeterId: 'MTR-2008',
    Feeder11Id: 'F11-NS-03',
    Feeder33Id: 'F33-NS-01',
    NameplateRating: 400
  },
  {
    Id: 203,
    Name: 'DT Pantelej',
    Latitude: 43.3312,
    Longitude: 21.9302,
    MeterId: 'MTR-3012',
    Feeder11Id: 'F11-NI-05',
    Feeder33Id: 'F33-NI-02',
    NameplateRating: 250
  }
];

export default function PowerGridDashboard() {
  const [transmissionStations, setTransmissionStations] = useState<BaseStation[]>([]);
  const [substations, setSubstations] = useState<BaseStation[]>([]);
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