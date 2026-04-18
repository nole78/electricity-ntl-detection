"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type  {BaseStation} from '@/components/station-map';
import type {DtStation} from '@/components/station-map';
import { AnomalyApiClient } from '@/api-client/anomaly/AnomalyApiClient';
import type { FeederAnomaly } from '@/api-client/anomaly/IAnomalyApiClient';

const PowerGridMap = dynamic(() => import("@/components/station-map"), {
  ssr: false,
  loading: () => <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">Učitavanje mape...</div>
});

const anomalyApiClient = new AnomalyApiClient('https://localhost:7061');

const mapAnomalyToStation = (anomaly: FeederAnomaly): DtStation => ({
  Id: anomaly.feeder11Id,
  Name: `${anomaly.feeder11Name} (${anomaly.anomalyScorePercent.toFixed(1)}%)`,
  Latitude: anomaly.centroidLatitude,
  Longitude: anomaly.centroidLongitude,
  Feeder11Id: anomaly.feeder11Id,
  MeterId: anomaly.classification
});

export default function PowerGridDashboard() {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadAnomalies = async () => {
      try {
        const anomalies = await anomalyApiClient.getAnomalies(abortController.signal);
        setErrorMessage(null);

        setTransmissionStations(
          anomalies
            .filter((item) => item.classification === 'TheftSuspected')
            .map(mapAnomalyToStation)
        );

        setSubstations(
          anomalies
            .filter((item) => item.classification === 'GhostOrDeadMeters')
            .map(mapAnomalyToStation)
        );

        setDtStations(
          anomalies
            .filter((item) => item.classification === 'Normal')
            .map(mapAnomalyToStation)
        );
      } catch (error) {
        if (!abortController.signal.aborted) {
          const message = error instanceof Error ? error.message : 'Unknown fetch error';
          console.error('Failed to fetch feeder anomalies:', message);
          setErrorMessage(message);
          setTransmissionStations([]);
          setSubstations([]);
          setDtStations([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadAnomalies();

    return () => abortController.abort();
  }, []);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Feeder Anomalije</h1>
        <p className="text-gray-500 mt-2">Prikaz centroida vodova sa detektovanim anomalijama i normalnim radom</p>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-4 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600"></div> Theft Suspected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600"></div> Ghost or Dead Meters
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-600"></div> Normal
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">
          Učitavanje anomalija...
        </div>
      ) : (
        <PowerGridMap
          transmissionStations={transmissionStations}
          substations={substations}
          dtStations={dtStations}
        />
      </div>
    </main>
  );
}