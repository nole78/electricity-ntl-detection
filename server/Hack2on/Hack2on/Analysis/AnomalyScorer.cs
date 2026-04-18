using Hack2on.Core.Common;
using Hack2on.Core.Models;

namespace Hack2on.Analysis;

/// <summary>
/// Scores a single feeder using a z-score based statistical outlier test
/// plus a physical sanity rule for near-zero consumption.
/// </summary>
public sealed class AnomalyScorer
{
    /// <summary>
    /// Feeders delivering less than this fraction of expected energy are
    /// classified as GhostOrDeadMeters regardless of z-score. Captures the
    /// physical "many DTs registered, zero energy flowing" case that can be
    /// masked by global z-score on heterogeneous feeder populations.
    /// </summary>
    private const double GhostEnergyFractionFloor = 0.10;

    private readonly AnalysisConfig _config;

    public AnomalyScorer(AnalysisConfig config)
    {
        _config = config;
    }

    public FeederAnomalyResult Score(
        FeederLoadSnapshot snapshot,
        BaselineStats baseline)
    {
        if (snapshot.RegisteredDtCount < _config.MinDtCountForAnalysis
            || baseline.MedianEnergyPerDt <= 0)
        {
            return BuildResult(
                snapshot,
                expected: 0,
                scorePercent: 0,
                zScore: 0,
                classification: AnomalyClassification.Normal,
                estimatedActiveDts: snapshot.RegisteredDtCount);
        }

        var expected = snapshot.RegisteredDtCount * baseline.MedianEnergyPerDt;
        var expectedStdDev = snapshot.RegisteredDtCount * baseline.StdDevEnergyPerDt;

        var zScore = expectedStdDev > 0
            ? (snapshot.TotalEnergyKwh - expected) / expectedStdDev
            : 0;

        var scorePercent = (snapshot.TotalEnergyKwh - expected) / expected * 100.0;

        var estimatedActive = (int)Math.Round(
            snapshot.TotalEnergyKwh / baseline.MedianEnergyPerDt);

        // Physical floor rule: a feeder with many registered DTs delivering
        // almost nothing is a clear ghost/dead case, even if z-score doesn't
        // catch it due to heterogeneous population variance.
        if (snapshot.TotalEnergyKwh < expected * GhostEnergyFractionFloor)
        {
            return BuildResult(
                snapshot,
                expected,
                scorePercent,
                zScore,
                AnomalyClassification.GhostOrDeadMeters,
                estimatedActiveDts: estimatedActive);
        }

        var classification = ClassifyByZScore(zScore);

        return BuildResult(
            snapshot, expected, scorePercent, zScore, classification, estimatedActive);
    }

    private AnomalyClassification ClassifyByZScore(double zScore)
    {
        if (zScore >= _config.TheftZScoreThreshold)
            return AnomalyClassification.TheftSuspected;

        if (zScore <= _config.GhostZScoreThreshold)
            return AnomalyClassification.GhostOrDeadMeters;

        return AnomalyClassification.Normal;
    }

    private static FeederAnomalyResult BuildResult(
        FeederLoadSnapshot snapshot,
        double expected,
        double scorePercent,
        double zScore,
        AnomalyClassification classification,
        int estimatedActiveDts)
    {
        return new FeederAnomalyResult
        {
            Feeder11Id = snapshot.Feeder11Id,
            Feeder11Name = snapshot.Feeder11Name,
            WindowStart = snapshot.WindowStart,
            WindowEnd = snapshot.WindowEnd,
            ActualEnergyKwh = snapshot.TotalEnergyKwh,
            ExpectedEnergyKwh = expected,
            AnomalyScorePercent = scorePercent,
            ZScore = zScore,
            Classification = classification,
            RegisteredDtCount = snapshot.RegisteredDtCount,
            EstimatedActiveDtCount = estimatedActiveDts
        };
    }
}