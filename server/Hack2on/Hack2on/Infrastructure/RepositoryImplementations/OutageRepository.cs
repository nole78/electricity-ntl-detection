using Dapper;
using Hack2on.Core.Abstractions;
using Hack2on.Core.Models;
using Hack2on.Infrastructure.Sql;
using Microsoft.Data.SqlClient;

namespace Hack2on.Infrastructure.RepositoryImplementations
{
    public class OutageRepository(string connectionString) : IOutageRepository
    {
        private readonly string _connectionString = connectionString;

        public async Task<IEnumerable<ActiveTelemetryOutage>> GetActiveTelemetryOutagesAsync()
        {
            await using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<ActiveTelemetryOutage>(OutageQueries.ActiveTelemetryOutages);
        }

        public async Task<IEnumerable<TelemetryGapOutage>> GetTelemetryGapOutagesAsync()
        {
            await using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<TelemetryGapOutage>(OutageQueries.TelemetryGapDetection);
        }

        public async Task<IEnumerable<CurrentOutageStatus>> GetZeroVoltageOrNoTelemetryAsync()
        {
            await using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<CurrentOutageStatus>(OutageQueries.Get0OrNullMeterReads);
        }
    }
}
