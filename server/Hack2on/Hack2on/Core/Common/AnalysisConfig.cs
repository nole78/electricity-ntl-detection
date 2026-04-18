namespace Hack2on.Core.Common
{
    public sealed class AnalysisConfig
    {
        /// <summary>
        /// Anomaly score (%) above which a feeder is flagged as theft-suspected.
        /// Default +20%
        /// </summary>
        public double TheftThresholdPercent { get; set; } = 20.0;

        /// <summary>
        /// Anomaly score (%) below which a feeder is flagged as ghost/dead
        /// Default -20% per problem spec
        /// </summary>
        public double GhostThresholdPercent { get; set; } = -20.0;

        /// <summary>
        /// Assumed technical loss percentage on an 11 kV feeder (resistive + transformer).
        /// Industry-standard range 4–7% Subtracted before NTL attribution.
        /// </summary>
        public double AssumedTechnicalLossPercent { get; set; } = 5.0;

        /// <summary>
        /// How far back from "now" (or from a requested end time) the default analysis
        /// window extends
        /// </summary>
        public TimeSpan DefaultWindow { get; set; } = TimeSpan.FromDays(7);

        /// <summary>
        /// Minimum number of DTs a feeder must have to be eligible for analysis.
        /// Prevents statistical noise on tiny feeders
        /// </summary>
        public int MinDtCountForAnalysis { get; set; } = 3;

        /// <summary>
        /// How long to cache the anomaly results in memory.
        /// </summary>
        public TimeSpan CacheDuration { get; set; } = TimeSpan.FromMinutes(10);
    }
}
