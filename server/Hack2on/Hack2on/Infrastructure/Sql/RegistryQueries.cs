namespace Hack2on.Infrastructure.Sql;

internal static class RegistryQueries
{
    public const string GetAllTransmissionStations = @"
        SELECT Id, Name, Latitude, Longitude
        FROM dbo.TransmissionStations
        WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL
        ORDER BY Id;";

    public const string GetAllSubstations = @"
        SELECT Id, Name, Latitude, Longitude
        FROM dbo.Substations
        WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL
        ORDER BY Id;";

    public const string GetAllDistributionSubstations = @"
        SELECT Id, Name, MeterId, Feeder11Id, Feeder33Id,
               NameplateRating, Latitude, Longitude
        FROM dbo.DistributionSubstation
        WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL
        ORDER BY Id;";

    public const string GetDistributionSubstationsByFeederIds = @"
    SELECT Id, Name, MeterId, Feeder11Id, Feeder33Id,
           NameplateRating, Latitude, Longitude
    FROM dbo.DistributionSubstation
    WHERE Latitude IS NOT NULL
      AND Longitude IS NOT NULL
      AND Feeder11Id IN @FeederIds
    ORDER BY Id;";
}