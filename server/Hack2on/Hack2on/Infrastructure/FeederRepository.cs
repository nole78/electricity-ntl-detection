using Dapper;
using Hack2on.Core.Abstractions;
using Hack2on.Core.Entities;
using Hack2on.Core.Models;
using Hack2on.Infrastructure.Persistence;
using Hack2on.Infrastructure.Sql;

namespace Hack2on.Infrastructure
{
    public sealed class FeederRepository : IFeederRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;

        public FeederRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IReadOnlyList<Feeder11>> GetAllFeeder11Async(CancellationToken ct = default)
        {
            using var connection = _connectionFactory.Create();
            var command = new CommandDefinition(FeederQueries.GetAllFeeder11, cancellationToken: ct);
            var rows = await connection.QueryAsync<Feeder11>(command);
            return rows.AsList();
        }

        public async Task<Feeder11?> GetFeeder11ByIdAsync(int id, CancellationToken ct = default)
        {
            using var connection = _connectionFactory.Create();
            var command = new CommandDefinition(
                FeederQueries.GetFeeder11ById,
                new { Id = id },
                cancellationToken: ct);

            return await connection.QuerySingleOrDefaultAsync<Feeder11>(command);
        }

        public async Task<IReadOnlyDictionary<int, int>> GetDtCountsPerFeederAsync(
            CancellationToken ct = default)
        {
            using var connection = _connectionFactory.Create();
            var command = new CommandDefinition(
                FeederQueries.GetDtCountsPerFeeder, cancellationToken: ct);

            var rows = await connection.QueryAsync<(int FeederId, int DtCount)>(command);
            return rows.ToDictionary(r => r.FeederId, r => r.DtCount);
        }

        public async Task<IReadOnlyList<DistributionSubstation>> GetDtsForFeederAsync(
            int feeder11Id, CancellationToken ct = default)
        {
            using var connection = _connectionFactory.Create();
            var command = new CommandDefinition(
                FeederQueries.GetDtsForFeeder,
                new { Feeder11Id = feeder11Id },
                cancellationToken: ct);

            var rows = await connection.QueryAsync<DistributionSubstation>(command);
            return rows.AsList();
        }

        public async Task<FeederCoverage> GetFeederCoverageAsync(CancellationToken ct = default)
        {
            using var connection = _connectionFactory.Create();
            var command = new CommandDefinition(
                FeederQueries.GetAnalyzableFeederCount, cancellationToken: ct);

            return await connection.QuerySingleAsync<FeederCoverage>(command);
        }

        public async Task<IReadOnlyDictionary<int, FeederGeometry>> GetFeederGeometryAsync(
            CancellationToken ct = default)
        {
            using var connection = _connectionFactory.Create();
            var cmd = new CommandDefinition(
                FeederQueries.GetFeederGeometry, cancellationToken: ct);

            var rows = await connection.QueryAsync<FeederGeometryRow>(cmd);

            return rows
                .Select(r => new FeederGeometry
                {
                    Feeder11Id = r.Feeder11Id,
                    SubstationLatitude = r.SubstationLatitude,
                    SubstationLongitude = r.SubstationLongitude,
                    TransmissionLatitude = r.TransmissionLatitude,
                    TransmissionLongitude = r.TransmissionLongitude,
                    DtCentroidLatitude = r.DtCentroidLatitude,
                    DtCentroidLongitude = r.DtCentroidLongitude,
                    DtWithCoordsCount = r.DtWithCoordsCount
                })
                .ToDictionary(g => g.Feeder11Id);
        }

        private sealed class FeederGeometryRow
        {
            public int Feeder11Id { get; set; }
            public double? SubstationLatitude { get; set; }
            public double? SubstationLongitude { get; set; }
            public double? TransmissionLatitude { get; set; }
            public double? TransmissionLongitude { get; set; }
            public double? DtCentroidLatitude { get; set; }
            public double? DtCentroidLongitude { get; set; }
            public int DtWithCoordsCount { get; set; }
        }
    }
}