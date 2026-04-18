using Hack2on.Core.Abstractions;
using Hack2on.Core.Entities;
using Dapper;
using Microsoft.Data.SqlClient;

namespace Hack2on.Infrastructure.RepositoryImplementations
{
    public class TransmissionStationRepository(string connectionString) : ITransmissionStationRepository
    {
        private readonly string _connectionString = connectionString;

        public async Task<IReadOnlyList<TransmissionStation>> GetAllTransmissionStationsAsync(CancellationToken ct)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(ct);
            const string sql = "SELECT Id, Name, Latitude, Longitude FROM TransmissionStation ORDER BY Name";
            var results = await connection.QueryAsync<TransmissionStation>(sql);
            return results.ToList().AsReadOnly();
        }
    }
}
