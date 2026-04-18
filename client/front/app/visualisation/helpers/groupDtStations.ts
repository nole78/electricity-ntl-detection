import type { DtStation } from '@/components/station-map';

interface DtGroup {
  id: string;
  sampleName: string;
  latitudeSum: number;
  longitudeSum: number;
  count: number;
  feeder11Counts: Record<string, number>;
  feeder33Counts: Record<string, number>;
  nameplateRatingSum: number;
}

const incrementCount = (counts: Record<string, number>, value: string | number | undefined) => {
  if (value == null) {
    return;
  }

  const key = String(value).trim();
  if (key.length === 0) {
    return;
  }

  counts[key] = (counts[key] ?? 0) + 1;
};

const getDominantValue = (counts: Record<string, number>): string | number | undefined => {
  const entries = Object.entries(counts);

  if (entries.length === 0) {
    return undefined;
  }

  const [dominantKey] = entries.sort((a, b) => b[1] - a[1])[0];
  const numericValue = Number(dominantKey);

  return Number.isFinite(numericValue) ? numericValue : dominantKey;
};

const getGridSizeForZoom = (zoom: number): number => {
  if (zoom <= 6) return 0.25;
  if (zoom <= 8) return 0.12;
  if (zoom <= 10) return 0.06;
  if (zoom <= 12) return 0.03;
  return 0.015;
};

export const groupDtStations = (stations: DtStation[], zoom: number): DtStation[] => {
  // Use larger geo cells when zoomed out and smaller cells when zoomed in.
  const gridSize = getGridSizeForZoom(zoom);
  const grouped = new Map<string, DtGroup>();

  for (const station of stations) {
    const feederKey = station.Feeder11Id != null ? String(station.Feeder11Id).trim() : 'unknown';
    const latCell = Math.round(station.Latitude / gridSize) * gridSize;
    const lngCell = Math.round(station.Longitude / gridSize) * gridSize;
    const key = `${feederKey}:${latCell}:${lngCell}`;

    const existing = grouped.get(key);

    if (existing) {
      existing.latitudeSum += station.Latitude;
      existing.longitudeSum += station.Longitude;
      existing.count += 1;
      existing.nameplateRatingSum += station.NameplateRating ?? 0;
      incrementCount(existing.feeder11Counts, station.Feeder11Id);
      incrementCount(existing.feeder33Counts, station.Feeder33Id);
      continue;
    }

    const feeder11Counts: Record<string, number> = {};
    const feeder33Counts: Record<string, number> = {};
    incrementCount(feeder11Counts, station.Feeder11Id);
    incrementCount(feeder33Counts, station.Feeder33Id);

    grouped.set(key, {
      id: `grp-${key}`,
      sampleName: station.Name,
      latitudeSum: station.Latitude,
      longitudeSum: station.Longitude,
      count: 1,
      feeder11Counts,
      feeder33Counts,
      nameplateRatingSum: station.NameplateRating ?? 0,
    });
  }

  return Array.from(grouped.values()).map((group) => ({
    Id: group.id,
    Name: group.count > 1 ? `${group.count} DT stations` : group.sampleName,
    Latitude: group.latitudeSum / group.count,
    Longitude: group.longitudeSum / group.count,
    MeterId: `${group.count} grouped`,
    Feeder11Id: getDominantValue(group.feeder11Counts),
    Feeder33Id: getDominantValue(group.feeder33Counts),
    NameplateRating: group.nameplateRatingSum > 0 ? Math.round(group.nameplateRatingSum) : undefined,
  }));
};
