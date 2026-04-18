namespace Hack2on.Infrastructure.Sql;

internal static class MeterReadQueries
{
    // ---------------------------------------------------------------------
    // Core aggregation — total energy per feeder for a time window
    //
    // Logic:
    //   1. Exclude meters assigned to multiple feeders (double-counting guard).
    //   2. Pull register reads for each head meter in the window.
    //   3. LAG() to get the previous read's Val per feeder.
    //   4. Delta = Val - PrevVal. Skip negative deltas (meter resets).
    //   5. Multiply by EffectiveMultiplier to convert Wh delta to kWh.
    //      All register values from this provider are stored in Wh.
    //      Dividing by 1000 converts to kWh.
    //      MultiplierFactor handles CT/PT ratio correction and is
    //      independent of unit conversion.
    //   6. Sum per feeder.
    //
    // Also returns registered DT count + total nameplate per feeder.
    // ---------------------------------------------------------------------
    public const string GetFeederLoadSnapshots = @"
        WITH ExcludedMeters AS (
            -- Meters assigned to more than one feeder would double-count
            SELECT MeterId
            FROM dbo.Feeders11
            WHERE MeterId IS NOT NULL
            GROUP BY MeterId
            HAVING COUNT(*) > 1
        ),
        HeadMeterReads AS (
            SELECT
                f.Id   AS Feeder11Id,
                f.Name AS Feeder11Name,
                mrt.Val,
                mrt.Ts,
                -- All values are in Wh: divide by 1000 to get kWh.
                -- MultiplierFactor is CT/PT ratio correction, not unit conversion.
                m.MultiplierFactor * 0.001 AS EffectiveMultiplier,
                LAG(mrt.Val) OVER (
                    PARTITION BY f.Id
                    ORDER BY mrt.Ts
                ) AS PrevVal
            FROM dbo.Feeders11 f
            INNER JOIN dbo.Meters m          ON m.Id  = f.MeterId
            INNER JOIN dbo.MeterReadTfes mrt ON mrt.Mid = f.MeterId
            WHERE f.MeterId IS NOT NULL
              AND f.MeterId NOT IN (SELECT MeterId FROM ExcludedMeters)
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
                        ELSE (Val - PrevVal) * EffectiveMultiplier
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

    // ---------------------------------------------------------------------
    // Per-timestamp load profile for one feeder (chart data)
    //
    // Same Wh->kWh conversion and duplicate meter exclusion as above.
    // ---------------------------------------------------------------------
    public const string GetFeederLoadProfile = @"
        WITH ExcludedMeters AS (
            SELECT MeterId
            FROM dbo.Feeders11
            WHERE MeterId IS NOT NULL
            GROUP BY MeterId
            HAVING COUNT(*) > 1
        ),
        HeadMeterReads AS (
            SELECT
                mrt.Ts,
                mrt.Val,
                -- All values are in Wh: divide by 1000 to get kWh.
                -- MultiplierFactor is CT/PT ratio correction, not unit conversion.
                m.MultiplierFactor * 0.001 AS EffectiveMultiplier,
                LAG(mrt.Val) OVER (ORDER BY mrt.Ts) AS PrevVal
            FROM dbo.Feeders11 f
            INNER JOIN dbo.Meters m          ON m.Id = f.MeterId
            INNER JOIN dbo.MeterReadTfes mrt ON mrt.Mid = f.MeterId
            WHERE f.Id = @Feeder11Id
              AND f.MeterId IS NOT NULL
              AND f.MeterId NOT IN (SELECT MeterId FROM ExcludedMeters)
              AND mrt.Ts >= @From
              AND mrt.Ts <  @To
        )
        SELECT
            Ts AS Timestamp,
            CASE
                WHEN PrevVal IS NULL   THEN 0
                WHEN Val - PrevVal < 0 THEN 0
                ELSE (Val - PrevVal) * EffectiveMultiplier
            END AS EnergyKwh
        FROM HeadMeterReads
        WHERE PrevVal IS NOT NULL
        ORDER BY Ts;";
}