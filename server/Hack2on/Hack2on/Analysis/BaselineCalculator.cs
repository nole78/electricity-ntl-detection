using Hack2on.Core.Common;
using Hack2on.Core.Models;

namespace Hack2on.Analysis;

/// <summary>
/// Computes statistical baseline across all analyzable feeders:
/// median kWh-per-DT (robust central tendency) and
/// standard deviation (for z-score based classification).
/// </summary>
public sealed class BaselineCalculator
{
    private readonly AnalysisConfig _config;

    public BaselineCalculator(AnalysisConfig config)
    {
        _config = config;
    }

    public BaselineStats Calculate(IReadOnlyList<FeederLoadSnapshot> snapshots)
    {
        if (snapshots.Count == 0)
            return new BaselineStats(0, 0);

        var perDtValues = snapshots
            .Where(s => s.RegisteredDtCount >= _config.MinDtCountForAnalysis)
            .Where(s => s.TotalEnergyKwh > 0)
            .Select(s => s.EnergyPerDt)
            .ToList();

        if (perDtValues.Count == 0)
            return new BaselineStats(0, 0);

        var sorted = perDtValues.OrderBy(x => x).ToList();
        var median = Median(sorted);

        var mean = perDtValues.Average();
        var sumSquares = perDtValues.Sum(v => (v - mean) * (v - mean));
        var stdDev = Math.Sqrt(sumSquares / perDtValues.Count);

        return new BaselineStats(median, stdDev);
    }

    private static double Median(IReadOnlyList<double> sortedValues)
    {
        var n = sortedValues.Count;
        if (n == 0) return 0;
        if (n % 2 == 1) return sortedValues[n / 2];
        return (sortedValues[n / 2 - 1] + sortedValues[n / 2]) / 2.0;
    }
}

public sealed record BaselineStats(double MedianEnergyPerDt, double StdDevEnergyPerDt);