import type { DtStation } from '@/components/station-map';
import type { FeederAnomaly } from '@/api-client/anomaly/IAnomalyApiClient';

interface SidePanelProps {
  isOpen: boolean;
  selectedDt: DtStation | null;
  feederInfo: FeederAnomaly | null;
  onClose: () => void;
}

export default function SidePanel({ isOpen, selectedDt, feederInfo, onClose }: SidePanelProps) {
  const panelClasses = isOpen
    ? 'translate-x-0 opacity-100 pointer-events-auto'
    : 'translate-x-full opacity-0 pointer-events-none';

  return (
    <aside className={`absolute right-0 top-0 z-1200 h-full w-full max-w-sm border-l border-emerald-700/60 bg-emerald-900/70 shadow-2xl backdrop-blur transition-all duration-300 ease-out md:max-w-md ${panelClasses}`}>
      <div className="flex items-center justify-between border-b border-emerald px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">DT Details</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-emerald-400/60 bg-emerald-800/40 px-3 py-1.5 text-sm font-medium text-emerald-50 hover:bg-blue-500/10 hover:border-blue-400/60"
        >
          Close
        </button>
      </div>

      <div className="space-y-5 overflow-y-auto p-5 text-sm text-emerald-100/80">
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Distribution Station</h3>
          <div><strong>Name:</strong> {selectedDt?.Name ?? 'N/A'}</div>
          <div><strong>ID:</strong> {selectedDt?.Id ?? 'N/A'}</div>
          <div><strong>Meter:</strong> {selectedDt?.MeterId ?? 'N/A'}</div>
          <div><strong>Feeder 11:</strong> {selectedDt?.Feeder11Id ?? 'N/A'}</div>
          <div><strong>Feeder 33:</strong> {selectedDt?.Feeder33Id ?? 'N/A'}</div>
          <div><strong>Nameplate:</strong> {selectedDt?.NameplateRating ?? 'N/A'}</div>
          <div>
            <strong>Coordinates:</strong> {selectedDt ? `${selectedDt.Latitude.toFixed(6)}, ${selectedDt.Longitude.toFixed(6)}` : 'N/A'}
          </div>
        </section>

        <section className="space-y-2 border-t border-slate-200 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Connected Feeder</h3>
          {feederInfo ? (
            <>
              <div><strong>Feeder:</strong> {feederInfo.feeder11Name}</div>
              <div><strong>Feeder ID:</strong> {feederInfo.feeder11Id}</div>
              <div><strong>Classification:</strong> {feederInfo.classification}</div>
              <div><strong>Anomaly score:</strong> {feederInfo.anomalyScorePercent.toFixed(2)}%</div>
            </>
          ) : (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">
              No anomaly feeder details found for this DT.
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
