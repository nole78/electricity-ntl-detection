namespace Hack2on.Core.Models
{
    /// <summary>Dashboard-level KPIs for the top-level summary endpoint</summary>
    public sealed class NtlSummary
    {
        public DateTime WindowStart { get; init; }
        public DateTime WindowEnd { get; init; }

        public int TotalFeedersAnalyzed { get; init; }
        public int NormalCount { get; init; }
        public int TheftSuspectedCount { get; init; }
        public int GhostOrDeadCount { get; init; }

        public double TotalEnergyDeliveredKwh { get; init; }
        public double EstimatedNtlEnergyKwh { get; init; }
        public double EstimatedNtlPercent { get; init; }
        public double TotalTechnicalLossKwh { get; init; }
        public IReadOnlyList<FeederAnomalyResult> TopOffenders { get; init; } = [];
    }
}
