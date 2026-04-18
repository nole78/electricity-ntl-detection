namespace Hack2on.Core.Common;

public sealed class AnalysisConfig
{
    /// <summary>
    /// Number of standard deviations above the baseline before a feeder is
    /// flagged as theft-suspected. Default 2.0 = ~97.7% confidence of outlier.
    /// </summary>
    public double TheftZScoreThreshold { get; set; } = 2.0;

    /// <summary>
    /// Number of standard deviations below the baseline before a feeder is
    /// flagged as ghost/dead. Default -2.0 = ~2.3% confidence of outlier.
    /// </summary>
    public double GhostZScoreThreshold { get; set; } = -2.0;

    /// <summary>
    /// Fallback technical loss percentage when per-feeder geometry is unavailable
    /// (e.g. missing substation coordinates).
    /// </summary>
    public double FallbackTechnicalLossPercent { get; set; } = 5.0;

    /// <summary>
    /// Standard ACSR conductor resistance for 11/33 kV distribution cables.
    /// IEC reference value, assumed when actual cable type isn't recorded.
    /// </summary>
    public double CableResistanceOhmsPerKm { get; set; } = 0.3;

    /// <summary>
    /// Power factor assumption for current derivation. Typical 0.85-0.95 for
    /// MV distribution; 0.9 is a standard mid-range default.
    /// </summary>
    public double AssumedPowerFactor { get; set; } = 0.9;
    public double CableWindingFactor { get; set; } = 1.3;

    /// <summary>
    /// Assumed line voltage in kV when converting power to current.
    /// 33 kV matches the dominant feeder class in this dataset.
    /// </summary>
    public double AssumedLineVoltageKv { get; set; } = 33.0;

    public TimeSpan DefaultWindow { get; set; } = TimeSpan.FromDays(7);
    public int MinDtCountForAnalysis { get; set; } = 10;
    public int CacheDurationMinutes { get; set; } = 10;
}