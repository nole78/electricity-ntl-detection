using Hack2on.Core.Common;
using Hack2on.Core.Models;

namespace Hack2on.Analysis
{
    public sealed class AnomalyScorer
    {
        private readonly AnalysisConfig _config;

        public AnomalyScorer(AnalysisConfig config)
        {
            _config = config;
        }

        public FeederAnomalyResult Score(FeederLoadSnapshot snapshot, double baselineEnergyPerDt)
        {
            // Feeders below the DT threshold stay in the result list for completeness
            // but are classified Normal with score 0 not actionable.
            if (snapshot.RegisteredDtCount < _config.MinDtCountForAnalysis
                || baselineEnergyPerDt <= 0)
            {
                return BuildResult(
                    snapshot,
                    expected: 0,
                    score: 0,
                    classification: AnomalyClassification.Normal,
                    estimatedActiveDts: snapshot.RegisteredDtCount);
            }

            var expected = snapshot.RegisteredDtCount * baselineEnergyPerDt;
            var score = (snapshot.TotalEnergyKwh - expected) / expected * 100.0;

            var classification = ClassifyScore(score);
            var estimatedActive = (int)Math.Round(snapshot.TotalEnergyKwh / baselineEnergyPerDt);

            return BuildResult(snapshot, expected, score, classification, estimatedActive);
        }

        private AnomalyClassification ClassifyScore(double scorePercent)
        {
            if (scorePercent > _config.TheftThresholdPercent)
                return AnomalyClassification.TheftSuspected;

            if (scorePercent < _config.GhostThresholdPercent)
                return AnomalyClassification.GhostOrDeadMeters;

            return AnomalyClassification.Normal;
        }

        private static FeederAnomalyResult BuildResult(
            FeederLoadSnapshot snapshot,
            double expected,
            double score,
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
                AnomalyScorePercent = score,
                Classification = classification,
                RegisteredDtCount = snapshot.RegisteredDtCount,
                EstimatedActiveDtCount = estimatedActiveDts
            };
        }
    }
}
