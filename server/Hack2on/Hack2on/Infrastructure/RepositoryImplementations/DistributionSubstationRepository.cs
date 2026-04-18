using Hack2on.Core.Abstractions;
using Hack2on.Core.Entities;
using Dapper;
using Microsoft.Data.SqlClient;

namespace Hack2on.Infrastructure.RepositoryImplementations
{
    public class DistributionSubstationRepository(string connectionString) : IDistributionSubstationRepository
    {
        private readonly string _connectionString = connectionString;

        public async Task<IReadOnlyList<DistributionSubstation>> GetAllDistributionSubstationAsync(CancellationToken ct = default)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(ct);
            const string sql = "SELECT Id, Name, MeterId, Feeder11Id, Feeder33Id, NameplateRating, Latitude, Longitude FROM DistributionSubstation ORDER BY Name";
            var results = await connection.QueryAsync<DistributionSubstation>(sql);
            return results.ToList().AsReadOnly();
        }
    }
}
