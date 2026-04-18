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
    }
}
