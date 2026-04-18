namespace Hack2on.Infrastructure.Sql
{
    internal static class FeederQueries
    {
        public const string GetAllFeeder11 = @"
        SELECT
            Id, Name, SsId, MeterId, Feeder33Id, NameplateRating, TsId
        FROM dbo.Feeders11
        ORDER BY Id;";

        public const string GetFeeder11ById = @"
        SELECT
            Id, Name, SsId, MeterId, Feeder33Id, NameplateRating, TsId
        FROM dbo.Feeders11
        WHERE Id = @Id;";

        public const string GetDtCountsPerFeeder = @"
        SELECT
            Feeder11Id AS FeederId,
            COUNT(*)   AS DtCount
        FROM dbo.DistributionSubstation
        WHERE Feeder11Id IS NOT NULL
        GROUP BY Feeder11Id;";

        public const string GetDtsForFeeder = @"
        SELECT
            Id, Name, MeterId, Feeder11Id, Feeder33Id,
            NameplateRating, Latitude, Longitude
        FROM dbo.DistributionSubstation
        WHERE Feeder11Id = @Feeder11Id
        ORDER BY Id;";


        public const string GetAnalyzableFeederCount = @"
        SELECT
            (SELECT COUNT(*) FROM dbo.Feeders11)                           AS TotalFeeders,
            (SELECT COUNT(*) FROM dbo.Feeders11 WHERE MeterId IS NOT NULL) AS FeedersWithHeadMeter,
            (SELECT COUNT(DISTINCT Feeder11Id)
             FROM dbo.DistributionSubstation
             WHERE Feeder11Id IS NOT NULL)                                 AS FeedersWithAtLeastOneDt;";

        public const string GetFeederGeometry = @"
    SELECT
        f.Id                              AS Feeder11Id,
        ss.Latitude                       AS SubstationLatitude,
        ss.Longitude                      AS SubstationLongitude,
        ts.Latitude                       AS TransmissionLatitude,
        ts.Longitude                      AS TransmissionLongitude,
        AVG(CAST(dt.Latitude  AS FLOAT))  AS DtCentroidLatitude,
        AVG(CAST(dt.Longitude AS FLOAT))  AS DtCentroidLongitude,
        COUNT(dt.Id)                      AS DtWithCoordsCount
    FROM dbo.Feeders11 f
    LEFT JOIN dbo.Substations          ss ON ss.Id = f.SsId
    LEFT JOIN dbo.TransmissionStations ts ON ts.Id = f.TsId
    LEFT JOIN dbo.DistributionSubstation dt
           ON dt.Feeder11Id = f.Id
          AND dt.Latitude  IS NOT NULL
          AND dt.Longitude IS NOT NULL
    GROUP BY f.Id, ss.Latitude, ss.Longitude, ts.Latitude, ts.Longitude;";
    }
}
