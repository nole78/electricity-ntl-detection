namespace Hack2on.Infrastructure.Sql
{
    internal static class MeterReadQueries
    {
        public const string GetFeederLoadSnapshots = @"
        WITH HeadMeterReads AS (
            SELECT
                f.Id   AS Feeder11Id,
                f.Name AS Feeder11Name,
                mrt.Val,
                mrt.Ts,
                m.MultiplierFactor,
                LAG(mrt.Val) OVER (
                    PARTITION BY f.Id
                    ORDER BY mrt.Ts
                ) AS PrevVal
            FROM dbo.Feeders11 f
            INNER JOIN dbo.Meters m          ON m.Id  = f.MeterId
            INNER JOIN dbo.MeterReadTfes mrt ON mrt.Mid = f.MeterId
            WHERE f.MeterId IS NOT NULL
              AND mrt.Ts >= @From
              AND mrt.Ts <  @To
        ),
        FeederEnergy AS (
            SELECT
                Feeder11Id,
                MAX(Feeder11Name) AS Feeder11Name,
                SUM(
                    CASE
                        WHEN PrevVal IS NULL       THEN 0
                        WHEN Val - PrevVal < 0     THEN 0
                        ELSE (Val - PrevVal) * MultiplierFactor
                    END
                ) AS TotalEnergyKwh
            FROM HeadMeterReads
            GROUP BY Feeder11Id
        ),
        DtAggregates AS (
            SELECT
                Feeder11Id,
                COUNT(*)                        AS DtCount,
                ISNULL(SUM(NameplateRating), 0) AS TotalNameplate
            FROM dbo.DistributionSubstation
            WHERE Feeder11Id IS NOT NULL
            GROUP BY Feeder11Id
        )
        SELECT
            fe.Feeder11Id                AS Feeder11Id,
            fe.Feeder11Name              AS Feeder11Name,
            @From                        AS WindowStart,
            @To                          AS WindowEnd,
            fe.TotalEnergyKwh            AS TotalEnergyKwh,
            ISNULL(da.DtCount, 0)        AS RegisteredDtCount,
            ISNULL(da.TotalNameplate, 0) AS TotalNameplateRating
        FROM FeederEnergy fe
        LEFT JOIN DtAggregates da ON da.Feeder11Id = fe.Feeder11Id
        ORDER BY fe.Feeder11Id;";


        public const string GetFeederLoadProfile = @"
        WITH HeadMeterReads AS (
            SELECT
                mrt.Ts,
                mrt.Val,
                m.MultiplierFactor,
                LAG(mrt.Val) OVER (ORDER BY mrt.Ts) AS PrevVal
            FROM dbo.Feeders11 f
            INNER JOIN dbo.Meters m          ON m.Id = f.MeterId
            INNER JOIN dbo.MeterReadTfes mrt ON mrt.Mid = f.MeterId
            WHERE f.Id = @Feeder11Id
              AND f.MeterId IS NOT NULL
              AND mrt.Ts >= @From
              AND mrt.Ts <  @To
        )
        SELECT
            Ts AS Timestamp,
            CASE
                WHEN PrevVal IS NULL   THEN 0
                WHEN Val - PrevVal < 0 THEN 0
                ELSE (Val - PrevVal) * MultiplierFactor
            END AS EnergyKwh
        FROM HeadMeterReads
        WHERE PrevVal IS NOT NULL
        ORDER BY Ts;";
    }
}

