using Hack2on.Core.Entities;
using Hack2on.Core.Models;

namespace Hack2on.Core.Abstractions
{

    public interface IAnomalyDetector
    {
        /// <summary>
        /// Runs the full detection pipeline for the given window:
        /// load aggregation → baseline calc → scoring → classification.
        /// </summary>
        Task<IReadOnlyList<FeederAnomalyResult>> DetectAsync(
            DateTime from, DateTime to, CancellationToken ct = default);

        /// <summary>Dashboard summary derived from the detection results.</summary>
        Task<NtlSummary> GetSummaryAsync(
            DateTime from, DateTime to, CancellationToken ct = default);
    }
}