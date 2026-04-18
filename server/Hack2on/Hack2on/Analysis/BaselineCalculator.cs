using Hack2on.Core.Common;
using Hack2on.Core.Models;

namespace Hack2on.Analysis
{

    /// <summary>
    /// Computes the cross-feeder baseline used to score each feeder.
    ///
    /// Baseline = MEDIAN kWh-per-DT across all analyzable feeders in the window.
    /// Median (not mean) so the outliers we're trying to detect don't skew their own baseline.
    /// </summary>
    public sealed class BaselineCalculator
    {
        private readonly AnalysisConfig _config;

        public BaselineCalculator(AnalysisConfig config)
        {
            _config = config;
        }

        public double CalculateMedianEnergyPerDt(IReadOnlyList<FeederLoadSnapshot> snapshots)
        {
            if (snapshots.Count == 0) return 0;

            var perDtValues = snapshots
                .Where(s => s.RegisteredDtCount >= _config.MinDtCountForAnalysis)
                .Where(s => s.TotalEnergyKwh > 0)
                .Select(s => s.EnergyPerDt)
                .OrderBy(x => x)
                .ToList();

            return Median(perDtValues);
        }

        private static double Median(IReadOnlyList<double> sortedValues)
        {
            var n = sortedValues.Count;
            if (n == 0) return 0;

            if (n % 2 == 1)
                return sortedValues[n / 2];

            return (sortedValues[n / 2 - 1] + sortedValues[n / 2]) / 2.0;
        }
    }
}
