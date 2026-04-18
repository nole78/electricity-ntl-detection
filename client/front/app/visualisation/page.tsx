"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { BaseStation } from '@/components/station-map';
import type { DtStation } from '@/components/station-map';
import { AnomalyApiClient } from '@/api-client/anomaly/AnomalyApiClient';
import type { FeederAnomaly } from '@/api-client/anomaly/IAnomalyApiClient';
import { StationsApiClient } from '@/api-client/stations-api/StationsApiClient';
import type {
  DistributionSubstationRecord,
  SubstationRecord,
  TransmissionStationRecord,
} from '@/api-client/stations-api/IStationsApiClient';
import SidePanel from './components/side-panel';

const PowerGridMap = dynamic(() => import('@/components/station-map'), {
  ssr: false,
  loading: () => <div className="h-150 w-full animate-pulse bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500">Loading map...</div>
});

const stationsApiClient = new StationsApiClient();
const anomalyApiClient = new AnomalyApiClient(process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5601');

const mapTransmissionStation = (station: TransmissionStationRecord): BaseStation | null => {
  if (station.latitude == null || station.longitude == null || station.name == null) {
    return null;
  }

  return {
    Id: station.id,
    Name: station.name,
    Latitude: station.latitude,
    Longitude: station.longitude,
  };
};

const mapSubstation = (station: SubstationRecord): BaseStation | null => {
  if (station.latitude == null || station.longitude == null || station.name == null) {
    return null;
  }

  return {
    Id: station.id,
    Name: station.name,
    Latitude: station.latitude,
    Longitude: station.longitude,
  };
};

const mapDistributionSubstation = (station: DistributionSubstationRecord): DtStation | null => {
  if (station.latitude == null || station.longitude == null || station.name == null) {
    return null;
  }

  return {
    Id: station.id,
    Name: station.name,
    Latitude: station.latitude,
    Longitude: station.longitude,
    MeterId: station.meterId ?? undefined,
    Feeder11Id: station.feeder11Id ?? undefined,
    Feeder33Id: station.feeder33Id ?? undefined,
    NameplateRating: station.nameplateRating ?? undefined,
  };
};

const isBaseStation = (station: BaseStation | null): station is BaseStation => station !== null;
const isDtStation = (station: DtStation | null): station is DtStation => station !== null;

export default function PowerGridDashboard() {
  const [transmissionStations, setTransmissionStations] = useState<BaseStation[]>([]);
  const [substations, setSubstations] = useState<BaseStation[]>([]);
  const [dtStations, setDtStations] = useState<DtStation[]>([]);
  const [anomaliesByFeederId, setAnomaliesByFeederId] = useState<Record<number, FeederAnomaly>>({});
  const [selectedDt, setSelectedDt] = useState<DtStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadStations = async () => {
      try {
        const [transmissionData, substationsData, anomalies] = await Promise.all([
          stationsApiClient.getTransmissionStations(abortController.signal),
          stationsApiClient.getSubstations(abortController.signal),
          anomalyApiClient.getAnomalies(abortController.signal),
        ]);

        const feederIds = Array.from(
          new Set(
            anomalies
              .filter((item) => item.classification !== 'Normal')
              .map((item) => item.feeder11Id),
          ),
        );

        const distributionSubstationsData = feederIds.length > 0
          ? await stationsApiClient.getDistributionSubstations({
              feederIds,
              signal: abortController.signal,
            })
          : [];

        const mappedTransmissionStations = transmissionData
          .map(mapTransmissionStation)
          .filter(isBaseStation);

        const mappedSubstations = substationsData
          .map(mapSubstation)
          .filter(isBaseStation);

        const mappedDtStations = distributionSubstationsData
          .map(mapDistributionSubstation)
          .filter(isDtStation);

        setErrorMessage(null);
        setSelectedDt(null);
        setTransmissionStations(mappedTransmissionStations);
        setSubstations(mappedSubstations);
        setDtStations(mappedDtStations);
        setAnomaliesByFeederId(
          anomalies.reduce<Record<number, FeederAnomaly>>((acc, anomaly) => {
            acc[anomaly.feeder11Id] = anomaly;
            return acc;
          }, {}),
        );
      } catch (error) {
        if (!abortController.signal.aborted) {
          const message = error instanceof Error ? error.message : 'Unknown fetch error';
          console.error('Failed to fetch station/anomaly data:', message);
          setErrorMessage(message);
          setTransmissionStations([]);
          setSubstations([]);
          setDtStations([]);
          setAnomaliesByFeederId({});
          setSelectedDt(null);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadStations();

    return () => abortController.abort();
  }, []);

  const selectedFeederId =
    selectedDt && selectedDt.Feeder11Id != null
      ? Number(selectedDt.Feeder11Id)
      : Number.NaN;
  const selectedFeederInfo = Number.isFinite(selectedFeederId)
    ? (anomaliesByFeederId[selectedFeederId] ?? null)
    : null;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-100">
      <div className="absolute left-4 top-4 z-1200 w-[calc(100%-2rem)] max-w-xl rounded-xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur">
        <h1 className="text-xl font-bold text-slate-900">Power Grid Stations</h1>
        <p className="mt-1 text-sm text-slate-600">Click a DT marker to open station details and its connected feeder.</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-slate-700">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-red-600"></div> Transmission Stations
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-blue-600"></div> Substations
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-green-600"></div> DT Stations
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="absolute bottom-4 left-4 z-1200 max-w-md rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 shadow-lg">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="flex h-full w-full animate-pulse items-center justify-center bg-gray-100 text-gray-500">
          Loading stations...
        </div>
      ) : (
        <>
          <PowerGridMap
            transmissionStations={transmissionStations}
            substations={substations}
            dtStations={dtStations}
            onDtSelect={setSelectedDt}
          />

          <SidePanel
            isOpen={selectedDt !== null}
            selectedDt={selectedDt}
            feederInfo={selectedFeederInfo}
            onClose={() => setSelectedDt(null)}
          />
        </>
      )}
    </main>
  );
}