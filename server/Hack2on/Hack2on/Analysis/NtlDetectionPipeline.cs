using Hack2on.Core.Abstractions;
using Hack2on.Core.Common;
using Hack2on.Core.Models;
namespace Hack2on.Analysis
{

    public sealed class NtlDetectionPipeline : IAnomalyDetector
    {
        private readonly IMeterReadRepository _meterReadRepository;
        private readonly BaselineCalculator _baselineCalculator;
        private readonly AnomalyScorer _scorer;
        private readonly AnalysisConfig _config;

        public NtlDetectionPipeline(
            IMeterReadRepository meterReadRepository,
            BaselineCalculator baselineCalculator,
            AnomalyScorer scorer,
            AnalysisConfig config)
        {
            _meterReadRepository = meterReadRepository;
            _baselineCalculator = baselineCalculator;
            _scorer = scorer;
            _config = config;
        }

        public async Task<IReadOnlyList<FeederAnomalyResult>> DetectAsync(
            DateTime from, DateTime to, CancellationToken ct = default)
        {
            var snapshots = await _meterReadRepository.GetFeederLoadSnapshotsAsync(from, to, ct);

            if (snapshots.Count == 0)
                return Array.Empty<FeederAnomalyResult>();

            var baseline = _baselineCalculator.CalculateMedianEnergyPerDt(snapshots);

            return snapshots
                .Select(s => _scorer.Score(s, baseline))
                .OrderByDescending(r => Math.Abs(r.AnomalyScorePercent))
                .ToList();
        }

        public async Task<NtlSummary> GetSummaryAsync(
            DateTime from, DateTime to, CancellationToken ct = default)
        {
            var allResults = await DetectAsync(from, to, ct);

            if (allResults.Count == 0)
            {
                return new NtlSummary
                {
                    WindowStart = from,
                    WindowEnd = to,
                    TopOffenders = Array.Empty<FeederAnomalyResult>()
                };
            }

            var totalEnergy = allResults.Sum(r => r.ActualEnergyKwh);
            var totalExpected = allResults.Sum(r => r.ExpectedEnergyKwh);

            var aggregateExcess = Math.Max(0, totalEnergy - totalExpected);
            var technicalLoss = totalEnergy * (_config.AssumedTechnicalLossPercent / 100.0);
            var ntlEnergy = Math.Max(0, aggregateExcess - technicalLoss);
            var ntlPercent = totalEnergy > 0 ? ntlEnergy / totalEnergy * 100.0 : 0;

            var topOffenders = allResults
                .Where(r => r.Classification != AnomalyClassification.Normal)
                .Take(10)
                .ToList();

            return new NtlSummary
            {
                WindowStart = from,
                WindowEnd = to,
                TotalFeedersAnalyzed = allResults.Count,
                NormalCount = allResults.Count(r => r.Classification == AnomalyClassification.Normal),
                TheftSuspectedCount = allResults.Count(r => r.Classification == AnomalyClassification.TheftSuspected),
                GhostOrDeadCount = allResults.Count(r => r.Classification == AnomalyClassification.GhostOrDeadMeters),
                TotalEnergyDeliveredKwh = totalEnergy,
                EstimatedNtlEnergyKwh = ntlEnergy,
                EstimatedNtlPercent = ntlPercent,
                TopOffenders = topOffenders
            };
        }
    }
}
