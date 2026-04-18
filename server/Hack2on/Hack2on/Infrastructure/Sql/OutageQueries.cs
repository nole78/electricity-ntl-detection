namespace Hack2on.Infrastructure.Sql
{
    public static class OutageQueries
    {
        public const string TelemetryGapDetection = @"
            WITH ReadGaps AS (
                SELECT 
                    Mid AS MeterId,
                    Ts AS CurrentReadTime,
                    LAG(Ts) OVER (PARTITION BY Mid ORDER BY Ts) AS PreviousReadTime,
                    DATEDIFF(
                        MINUTE,
                        LAG(Ts) OVER (PARTITION BY Mid ORDER BY Ts),
                        Ts
                    ) AS GapInMinutes
                FROM [dbo].[MeterReads]
            ),
            ValidGaps AS (
                SELECT *
                FROM ReadGaps
                WHERE PreviousReadTime IS NOT NULL
                  AND GapInMinutes > 60
            )
            SELECT TOP 100
                vg.MeterId,
                vg.PreviousReadTime AS PowerLostTime,
                vg.CurrentReadTime AS PowerRestoredTime,
                vg.GapInMinutes AS OutageDurationMinutes,

                s.Id AS SubstationId,
                f33.Id AS Feeder33Id,
                ts.Id AS TransmissionStationId

            FROM ValidGaps vg

            JOIN [dbo].[Meters] m ON m.Id = vg.MeterId

            -- 11kV feeder
            JOIN [dbo].[Feeders11] f11 ON f11.MeterId = m.Id

            -- substation
            JOIN [dbo].[Substations] s ON s.Id = f11.SsId

            -- 33kV feeder
            JOIN [dbo].[Feeders33] f33 ON f33.Id = f11.Feeder33Id

            -- transmission station
            JOIN [dbo].[TransmissionStations] ts ON ts.Id = f33.TsId

            -- 🔥 KLJUČNI DEO
            WHERE 
                s.Id IS NOT NULL
                AND f33.Id IS NOT NULL
                AND ts.Id IS NOT NULL

            ORDER BY vg.GapInMinutes DESC;";

        public const string ActiveTelemetryOutages = @"
            WITH LastReads AS (
                SELECT
                    mr.Mid AS MeterId,
                    mr.Ts AS LastReadTime,
                    ROW_NUMBER() OVER (PARTITION BY mr.Mid ORDER BY mr.Ts DESC) AS rn
                FROM [dbo].[MeterReads] mr
            )
            SELECT TOP 100
                lr.MeterId,
                lr.LastReadTime AS DetectedAt,
                DATEDIFF(MINUTE, lr.LastReadTime, GETDATE()) AS OutageDurationMinutes
            FROM LastReads lr
            JOIN [dbo].[Feeders11] f11
                ON f11.MeterId = lr.MeterId
            JOIN [dbo].[Substations] s
                ON s.Id = f11.SsId
            JOIN [dbo].[Feeders33] f33
                ON f33.Id = f11.Feeder33Id
            JOIN [dbo].[TransmissionStations] ts
                ON ts.Id = COALESCE(f11.TsId, f33.TsId)
            WHERE lr.rn = 1
              AND DATEDIFF(MINUTE, lr.LastReadTime, GETDATE()) > 60
              AND s.Id IS NOT NULL
              AND f33.Id IS NOT NULL
              AND ts.Id IS NOT NULL
            ORDER BY OutageDurationMinutes DESC;";

        public const string Get0OrNullMeterReads = @"
            WITH AllStationsMeters AS (
                SELECT TOP 100 'Distribution Substation' AS StationType, Name AS StationName, MeterId
                FROM [dbo].[DistributionSubstation]
                WHERE MeterId IS NOT NULL

                UNION ALL

                SELECT 'Substation', s.Name, f11.MeterId
                FROM [dbo].[Substations] s
                JOIN [dbo].[Feeders11] f11 ON s.Id = f11.SsId
                WHERE f11.MeterId IS NOT NULL

                UNION ALL

                SELECT 'Transmission Station', ts.Name, f33.MeterId
                FROM [dbo].[TransmissionStations] ts
                JOIN [dbo].[Feeders33] f33 ON ts.Id = f33.TsId
                WHERE f33.MeterId IS NOT NULL
            ),
            LastReads AS (
                SELECT 
                    mr.*,
                    ROW_NUMBER() OVER (PARTITION BY mr.Mid ORDER BY mr.Ts DESC) AS rn
                FROM [dbo].[MeterReads] mr
            )
            SELECT 
                asm.StationType,
                asm.StationName,
                m.Id AS MeterId,
                m.MSN AS MeterSerialNumber,
                lr.Val AS ReadValue,
                lr.Ts AS ReadTimestamp,
                c.Name AS ChannelName,
                c.Unit,
                CASE
                    WHEN lr.Id IS NULL THEN 'No telemetry'
                    WHEN c.Unit = 'V' AND lr.Val = 0 THEN 'Zero voltage'
                END AS OutageReason
            FROM AllStationsMeters asm
            JOIN [dbo].[Meters] m ON asm.MeterId = m.Id
            LEFT JOIN LastReads lr ON lr.Mid = m.Id AND lr.rn = 1
            LEFT JOIN [dbo].[Channels] c ON lr.Cid = c.Id
            WHERE c.Unit = 'V' AND lr.Val = 0;";
    }
}
