namespace Hack2on.Core.Models
{
    /// <summary>
    /// Running NTL Detector against one feeder at time
    /// </summary>
    public sealed class FeederAnomalyResult
    {
        public int Feeder11Id { get; init; }
        public string? Feeder11Name { get; init; }

        public DateTime WindowStart { get; init; }
        public DateTime WindowEnd { get; init; }

        public double ActualEnergyKwh { get; init; }
        public double ExpectedEnergyKwh { get; init; }

        /// <summary>(actual - expected) / expected X 100. Positive = over negative = under</summary>
        public double AnomalyScorePercent { get; init; }

        public AnomalyClassification Classification { get; init; }

        public int RegisteredDtCount { get; init; }

        /// <summary>
        /// Back-calculated estimate of how many DTs are effectively active
        /// given the actual measured load and the cross-feeder median per-DT consumption.
        /// </summary>
        public int EstimatedActiveDtCount { get; init; }

        public double ZScore { get; init; }
    }
}
