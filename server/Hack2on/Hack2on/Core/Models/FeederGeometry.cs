namespace Hack2on.Core.Models;

public sealed class FeederGeometry
{
    public int Feeder11Id { get; init; }
    public double? SubstationLatitude { get; init; }
    public double? SubstationLongitude { get; init; }
    public double? TransmissionLatitude { get; init; }
    public double? TransmissionLongitude { get; init; }
    public double? DtCentroidLatitude { get; init; }
    public double? DtCentroidLongitude { get; init; }
    public int DtWithCoordsCount { get; init; }

    /// <summary>
    /// Best-effort source point: prefer Substation, fall back to TransmissionStation.
    /// Returns null if neither has coordinates.
    /// </summary>
    public (double Lat, double Lng)? SourcePoint =>
        (SubstationLatitude, SubstationLongitude) switch
        {
            (double lat, double lng) => (lat, lng),
            _ when TransmissionLatitude is double tLat
                && TransmissionLongitude is double tLng => (tLat, tLng),
            _ => null
        };

    public (double Lat, double Lng)? CentroidPoint =>
        (DtCentroidLatitude, DtCentroidLongitude) switch
        {
            (double lat, double lng) => (lat, lng),
            _ => null
        };
}