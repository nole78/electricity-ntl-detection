namespace Hack2on.Core.Models
{
    /// <summary>
    /// Aggregated energy throughput for a single Feeder11 over an analysis window
    /// Computed from hourly deltas of the head-    end meter's cumulative register
    /// </summary>
    public sealed class FeederLoadSnapshot
    {
        public int Feeder11Id { get; init; }
        public string? Feeder11Name { get; init; }
        public DateTime WindowStart { get; init; }
        public DateTime WindowEnd { get; init; }

        /// <summary>
        /// Total energy (kWh) flowing through the feeder head meter in the window.
        /// Sum of hourly deltas X meter multiplier factor
        /// </summary>
        public double TotalEnergyKwh { get; init; }

        /// <summary>Number of DistributionSubstation records linked to this feeder</summary>
        public int RegisteredDtCount { get; init; }

        /// <summary>
        /// Sum of NameplateRating across all DTs under this feeder (kVA capacity proxy).
        /// Used as a secondary baseline signal.
        /// </summary>
        public int TotalNameplateRating { get; init; }

        /// <summary>Average load per registered DT in the window (kWh)</summary>
        public double EnergyPerDt =>
            RegisteredDtCount > 0 ? TotalEnergyKwh / RegisteredDtCount : 0;
    }
}
