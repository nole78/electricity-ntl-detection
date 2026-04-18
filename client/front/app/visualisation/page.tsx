"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Substation } from '@/components/station-map';

// Dynamically import the map with SSR disabled
const SubstationMap = dynamic(() => import('@/components/station-map'), {
  ssr: false,
  loading: () => <div className="h-125 w-full animate-pulse bg-gray-200 flex items-center justify-center rounded-lg">Loading Map...</div>
});

const dummySubstations: Substation[] = [
  { Id: 1, Name: 'Belgrade North Substation', Latitude: 44.8623, Longitude: 20.3951 },
  { Id: 2, Name: 'Novi Sad Central Substation', Latitude: 45.2671, Longitude: 19.8335 },
  { Id: 3, Name: 'Ni\u0161 East Substation', Latitude: 43.3209, Longitude: 21.8958 },
  { Id: 4, Name: 'Kragujevac West Substation', Latitude: 44.0128, Longitude: 20.9114 },
  { Id: 5, Name: 'Subotica Industrial Substation', Latitude: 46.1002, Longitude: 19.6675 }
];

export default function SubstationsPage() {
  const [substations] = useState<Substation[]>(dummySubstations);

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Srednjenaponske podstanice (Substations)</h1>
      
      <SubstationMap substations={substations} />
    </main>
  );
}