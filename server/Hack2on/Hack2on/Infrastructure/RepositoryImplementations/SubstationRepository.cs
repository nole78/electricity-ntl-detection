using Hack2on.Core.Abstractions;
using Hack2on.Core.Entities;
using Dapper;
using Microsoft.Data.SqlClient;

namespace Hack2on.Infrastructure.RepositoryImplementations
{
    public class SubstationRepository(string connectionString) : ISubstationRepository
    {
        private readonly string _connectionString = connectionString;

        public async Task<IReadOnlyList<Substation>> GetAllSubstationsAsync(CancellationToken ct)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(ct);
            const string sql = "SELECT Id, Name, Latitude, Longitude FROM Substations ORDER BY Name";
            var results = await connection.QueryAsync<Substation>(sql);
            return results.ToList().AsReadOnly();
        }
    }
}
