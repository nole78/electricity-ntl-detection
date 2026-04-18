using Hack2on.Core.Abstractions;
using Hack2on.Core.Entities;

namespace Hack2on.Infrastructure.RepositoryImplementations
{
    public class FeederRepository(IDatabase<Feeder11> database) : IFeederRepository
    {
        private readonly IDatabase<Feeder11> _database = database;

        public async Task<IReadOnlyList<Feeder11>> GetAllFeeder11Async(CancellationToken ct = default)
        {
            const string sql = "SELECT Id, Name, SsId, MeterId, Feeder33Id, NameplateRating, TsId FROM Feeder11";
            return await _database.QueryAsync<Feeder11>(sql, ct: ct);
        }

        public async Task<Feeder11?> GetFeeder11ByIdAsync(int id, CancellationToken ct = default)
        {
            const string sql = "SELECT Id, Name, SsId, MeterId, Feeder33Id, NameplateRating, TsId FROM Feeder11 WHERE Id = @Id";
            return await _database.QuerySingleOrDefaultAsync<Feeder11>(sql, new { Id = id }, ct);
        }

        public async Task<IReadOnlyDictionary<int, int>> GetDtCountsPerFeederAsync(CancellationToken ct = default)
        {
            const string sql = @"
                SELECT Feeder11Id, COUNT(*) as Count
                FROM DistributionSubstation
                WHERE Feeder11Id IS NOT NULL
                GROUP BY Feeder11Id";

            var results = await _database.QueryAsync<dynamic>(sql, ct: ct);
            return results
                .ToDictionary(
                    r => (int)r.Feeder11Id,
                    r => (int)r.Count)
                .AsReadOnly();
        }

        public async Task<IReadOnlyList<DistributionSubstation>> GetDtsForFeederAsync(int feeder11Id, CancellationToken ct = default)
        {
            const string sql = @"
                SELECT Id, Name, MeterId, Feeder11Id, Feeder33Id, NameplateRating, Latitude, Longitude
                FROM DistributionSubstation
                WHERE Feeder11Id = @Feeder11Id
                ORDER BY Name";

            return await _database.QueryAsync<DistributionSubstation>(sql, new { Feeder11Id = feeder11Id }, ct);
        }
    }
}
