using Hack2on.Core.Abstractions;
using Hack2on.Core.Entities;
using Dapper;
using Microsoft.Data.SqlClient;

namespace Hack2on.Infrastructure.RepositoryImplementations
{
    public class FeederRepository(string connectionString) : IFeederRepository
    {
        private readonly string _connectionString = connectionString;

        public async Task<IReadOnlyList<Feeder11>> GetAllFeeder11Async(CancellationToken ct = default)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(ct);
            const string sql = "SELECT Id, Name, SsId, MeterId, Feeder33Id, NameplateRating, TsId FROM Feeder11";
            var results = await connection.QueryAsync<Feeder11>(sql);
            return results.ToList().AsReadOnly();
        }

        public async Task<Feeder11?> GetFeeder11ByIdAsync(int id, CancellationToken ct = default)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(ct);
            const string sql = "SELECT Id, Name, SsId, MeterId, Feeder33Id, NameplateRating, TsId FROM Feeder11 WHERE Id = @Id";
            return await connection.QuerySingleOrDefaultAsync<Feeder11>(sql, new { Id = id });
        }

        public async Task<IReadOnlyDictionary<int, int>> GetDtCountsPerFeederAsync(CancellationToken ct = default)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(ct);
            const string sql = @"
                SELECT Feeder11Id, COUNT(*) as Count
                FROM DistributionSubstation
                WHERE Feeder11Id IS NOT NULL
                GROUP BY Feeder11Id";

            var results = await connection.QueryAsync<dynamic>(sql);
            return results
                .ToDictionary(
                    r => (int)r.Feeder11Id,
                    r => (int)r.Count)
                .AsReadOnly();
        }

        public async Task<IReadOnlyList<DistributionSubstation>> GetDtsForFeederAsync(int feeder11Id, CancellationToken ct = default)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(ct);
            const string sql = @"
                SELECT Id, Name, MeterId, Feeder11Id, Feeder33Id, NameplateRating, Latitude, Longitude
                FROM DistributionSubstation
                WHERE Feeder11Id = @Feeder11Id
                ORDER BY Name";

            var results = await connection.QueryAsync<DistributionSubstation>(sql, new { Feeder11Id = feeder11Id });
            return results.ToList().AsReadOnly();
        }
    }
}
