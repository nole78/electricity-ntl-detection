using Hack2on.Core.Common;
using Hack2on.Core.Models;

namespace Hack2on.Analysis;

/// <summary>
/// Estimates per-feeder technical losses using I²R physics.
/// Line length is derived from Haversine distance between the feeder's
/// source point (substation or TS) and the centroid of its DTs, scaled
/// by a winding factor to approximate real cable routing.
/// </summary>
public sealed class TechnicalLossCalculator
{
    private const double SqrtThree = 1.7320508075688772;
    private const double EarthRadiusKm = 6371.0;

    private readonly AnalysisConfig _config;

    public TechnicalLossCalculator(AnalysisConfig config)
    {
        _config = config;
    }

    /// <summary>
    /// Estimates energy lost to resistive heating in kWh over the window.
    /// Returns 0 if geometry is unavailable (caller should apply fallback %).
    /// </summary>
    public double EstimateTechnicalLossKwh(
        double totalEnergyKwh,
        double windowHours,
        FeederGeometry? geometry)
    {
        if (totalEnergyKwh <= 0 || windowHours <= 0 || geometry == null)
            return 0;

        var source = geometry.SourcePoint;
        var centroid = geometry.CentroidPoint;
        if (source == null || centroid == null) return 0;

        var straightKm = HaversineKm(
            source.Value.Lat, source.Value.Lng,
            centroid.Value.Lat, centroid.Value.Lng);

        if (straightKm <= 0) return 0;

        var effectiveLengthKm = straightKm * _config.CableWindingFactor;

        // Average power (kW) over the window
        var avgPowerKw = totalEnergyKwh / windowHours;

        // I = P / (√3 × V × cos φ)  — three-phase
        var avgCurrentAmps = (avgPowerKw * 1000.0)
                           / (SqrtThree
                              * _config.AssumedLineVoltageKv * 1000.0
                              * _config.AssumedPowerFactor);

        // P_loss = 3 × I² × R (three phases)
        var resistanceOhms = _config.CableResistanceOhmsPerKm * effectiveLengthKm;
        var powerLossW = 3.0 * avgCurrentAmps * avgCurrentAmps * resistanceOhms;
        var powerLossKw = powerLossW / 1000.0;

        return powerLossKw * windowHours;
    }

    /// <summary>
    /// Great-circle distance between two lat/long points in kilometers.
    /// </summary>
    public static double HaversineKm(
        double lat1, double lon1, double lat2, double lon2)
    {
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2)
              + Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2))
              * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return EarthRadiusKm * c;
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;
}