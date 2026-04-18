using Dapper;
using Hack2on.Core.Abstractions;
using Hack2on.Core.Models;
using Hack2on.Infrastructure.Persistence;
using Hack2on.Infrastructure.Sql;

namespace Hack2on.Infrastructure
{
    public sealed class MeterReadRepository : IMeterReadRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;

        private const int LongQueryTimeoutSeconds = 120;

        public MeterReadRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IReadOnlyList<FeederLoadSnapshot>> GetFeederLoadSnapshotsAsync(
            DateTime from, DateTime to, CancellationToken ct = default)
        {
            if (to <= from)
                throw new ArgumentException("'to' must be greater than 'from'.", nameof(to));

            using var connection = _connectionFactory.Create();
            var command = new CommandDefinition(
                MeterReadQueries.GetFeederLoadSnapshots,
                new { From = from, To = to },
                commandTimeout: LongQueryTimeoutSeconds,
                cancellationToken: ct);

            var rows = await connection.QueryAsync<FeederLoadSnapshotRow>(command);

            return rows
                .Select(r => new FeederLoadSnapshot
                {
                    Feeder11Id = r.Feeder11Id,
                    Feeder11Name = r.Feeder11Name,
                    WindowStart = r.WindowStart,
                    WindowEnd = r.WindowEnd,
                    TotalEnergyKwh = r.TotalEnergyKwh,
                    RegisteredDtCount = r.RegisteredDtCount,
                    TotalNameplateRating = r.TotalNameplateRating
                })
                .ToList();
        }

        public async Task<IReadOnlyList<FeederLoadPoint>> GetFeederLoadProfileAsync(
            int feeder11Id, DateTime from, DateTime to, CancellationToken ct = default)
        {
            if (to <= from)
                throw new ArgumentException("'to' must be greater than 'from'.", nameof(to));

            using var connection = _connectionFactory.Create();
            var command = new CommandDefinition(
                MeterReadQueries.GetFeederLoadProfile,
                new { Feeder11Id = feeder11Id, From = from, To = to },
                commandTimeout: LongQueryTimeoutSeconds,
                cancellationToken: ct);

            var rows = await connection.QueryAsync<FeederLoadPointRow>(command);

            return rows
                .Select(r => new FeederLoadPoint
                {
                    Timestamp = r.Timestamp,
                    EnergyKwh = r.EnergyKwh
                })
                .ToList();
        }

        // Dapper-friendly landing types (mutable); mapped into immutable Core DTOs above
        private sealed class FeederLoadSnapshotRow
        {
            public int Feeder11Id { get; set; }
            public string? Feeder11Name { get; set; }
            public DateTime WindowStart { get; set; }
            public DateTime WindowEnd { get; set; }
            public double TotalEnergyKwh { get; set; }
            public int RegisteredDtCount { get; set; }
            public int TotalNameplateRating { get; set; }
        }

        private sealed class FeederLoadPointRow
        {
            public DateTime Timestamp { get; set; }
            public double EnergyKwh { get; set; }
        }
    }
}
