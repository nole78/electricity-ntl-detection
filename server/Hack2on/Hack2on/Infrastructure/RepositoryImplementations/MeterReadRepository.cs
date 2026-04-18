//using Hack2on.Core.Abstractions;
//using Hack2on.Core.Models;
//using Dapper;
//using Microsoft.Data.SqlClient;

//namespace Hack2on.Infrastructure.RepositoryImplementations
//{
//    public class MeterReadRepository(string connectionString) : IMeterReadRepository
//    {
//        private readonly string _connectionString = connectionString;

//        public async Task<IReadOnlyList<FeederLoadSnapshot>> GetFeederLoadSnapshotsAsync(DateTime from, DateTime to, CancellationToken ct = default)
//        {
//            using var connection = new SqlConnection(_connectionString);
//            await connection.OpenAsync(ct);
//            const string sql = @"
//                SELECT 
//                    f.Id as Feeder11Id,
//                    f.Name as Feeder11Name,
//                    @From as WindowStart,
//                    @To as WindowEnd,
//                    COALESCE(SUM(mr.EnergyDelta * m.MultiplierFactor), 0) as TotalEnergyKwh,
//                    COUNT(DISTINCT ds.Id) as RegisteredDtCount,
//                    COALESCE(SUM(ds.NameplateRating), 0) as TotalNameplateRating
//                FROM Feeder11 f
//                LEFT JOIN Meter m ON f.MeterId = m.Id
//                LEFT JOIN MeterRead mr ON m.Id = mr.MeterId 
//                    AND mr.Timestamp >= @From 
//                    AND mr.Timestamp < @To
//                LEFT JOIN DistributionSubstation ds ON f.Id = ds.Feeder11Id
//                GROUP BY f.Id, f.Name
//                ORDER BY f.Id";

//            var results = await connection.QueryAsync<FeederLoadSnapshot>(sql, new { From = from, To = to });
//            return results.ToList().AsReadOnly();
//        }

//        public async Task<IReadOnlyList<FeederLoadPoint>> GetFeederLoadProfileAsync(int feeder11Id, DateTime from, DateTime to, CancellationToken ct = default)
//        {
//            using var connection = new SqlConnection(_connectionString);
//            await connection.OpenAsync(ct);
//            const string sql = @"
//                SELECT 
//                    mr.Timestamp,
//                    COALESCE(mr.EnergyDelta * m.MultiplierFactor, 0) as EnergyKwh
//                FROM Feeder11 f
//                INNER JOIN Meter m ON f.MeterId = m.Id
//                INNER JOIN MeterRead mr ON m.Id = mr.MeterId
//                WHERE f.Id = @Feeder11Id
//                    AND mr.Timestamp >= @From
//                    AND mr.Timestamp < @To
//                ORDER BY mr.Timestamp";

//            var results = await connection.QueryAsync<FeederLoadPoint>(sql, new { Feeder11Id = feeder11Id, From = from, To = to });
//            return results.ToList().AsReadOnly();
//        }
//    }
//}
