using Hack2on.Core.Abstractions;
using Hack2on.Core.Common;
using Hack2on.Core.Models;

namespace Hack2on.Analysis;

public sealed class NtlDetectionPipeline : IAnomalyDetector
{
    private readonly IMeterReadRepository _meterReadRepository;
    private readonly IFeederRepository _feederRepository;
    private readonly BaselineCalculator _baselineCalculator;
    private readonly AnomalyScorer _scorer;
    private readonly TechnicalLossCalculator _lossCalculator;
    private readonly AnalysisConfig _config;

    public NtlDetectionPipeline(
        IMeterReadRepository meterReadRepository,
        IFeederRepository feederRepository,
        BaselineCalculator baselineCalculator,
        AnomalyScorer scorer,
        TechnicalLossCalculator lossCalculator,
        AnalysisConfig config)
    {
        _meterReadRepository = meterReadRepository;
        _feederRepository = feederRepository;
        _baselineCalculator = baselineCalculator;
        _scorer = scorer;
        _lossCalculator = lossCalculator;
        _config = config;
    }

    public async Task<IReadOnlyList<FeederAnomalyResult>> DetectAsync(
        DateTime from, DateTime to, CancellationToken ct = default)
    {
        var snapshots = await _meterReadRepository.GetFeederLoadSnapshotsAsync(from, to, ct);
        if (snapshots.Count == 0)
            return Array.Empty<FeederAnomalyResult>();

        var baseline = _baselineCalculator.Calculate(snapshots);

        return snapshots
            .Select(s => _scorer.Score(s, baseline))
            .OrderByDescending(r => Math.Abs(r.ZScore))
            .ToList();
    }

    public async Task<NtlSummary> GetSummaryAsync(
        DateTime from, DateTime to, CancellationToken ct = default)
    {
        var snapshotsTask = _meterReadRepository.GetFeederLoadSnapshotsAsync(from, to, ct);
        var geometryTask = _feederRepository.GetFeederGeometryAsync(ct);
        await Task.WhenAll(snapshotsTask, geometryTask);

        var snapshots = await snapshotsTask;
        var geometry = await geometryTask;

        if (snapshots.Count == 0)
        {
            return new NtlSummary
            {
                WindowStart = from,
                WindowEnd = to,
                TopOffenders = Array.Empty<FeederAnomalyResult>()
            };
        }

        var baseline = _baselineCalculator.Calculate(snapshots);
        var allResults = snapshots
            .Select(s => _scorer.Score(s, baseline))
            .OrderByDescending(r => Math.Abs(r.ZScore))
            .ToList();

        // Per-feeder physics-based technical losses (Haversine + I²R)
        var windowHours = (to - from).TotalHours;
        double totalTechnicalLoss = 0;

        foreach (var result in allResults)
        {
            var feederGeometry = geometry.GetValueOrDefault(result.Feeder11Id);
            var physicsLoss = _lossCalculator.EstimateTechnicalLossKwh(
                result.ActualEnergyKwh, windowHours, feederGeometry);

            // Cap at 15% of throughput — physical maximum for MV distribution
            var sanityCap = result.ActualEnergyKwh * 0.15;
            if (physicsLoss > sanityCap || physicsLoss <= 0)
                physicsLoss = result.ActualEnergyKwh
                            * (_config.FallbackTechnicalLossPercent / 100.0);

            totalTechnicalLoss += physicsLoss;
        }

        var totalEnergy = allResults.Sum(r => r.ActualEnergyKwh);

        // NTL = energy drawn above expected, ONLY on theft-flagged feeders.
        // Ghost/dead feeders are a separate category (unbilled revenue from
        // dead meters), not NTL loss. Summing both cancels theft against ghosts.
        var ntlEnergy = allResults
            .Where(r => r.Classification == AnomalyClassification.TheftSuspected)
            .Sum(r => Math.Max(0, r.ActualEnergyKwh - r.ExpectedEnergyKwh));

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
            TotalTechnicalLossKwh = totalTechnicalLoss,
            EstimatedNtlEnergyKwh = ntlEnergy,
            EstimatedNtlPercent = ntlPercent,
            TopOffenders = topOffenders
        };
    }
}