using Dapper;
using Hack2on.Core.Abstractions;
using Hack2on.Core.Entities;
using Hack2on.Infrastructure.Persistence;
using Hack2on.Infrastructure.Sql;

namespace Hack2on.Infrastructure;
public sealed class RegistryRepository : IRegistryRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public RegistryRepository(ISqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyList<TransmissionStation>> GetTransmissionStationsAsync(CancellationToken ct = default)
    {
        using var connection = _connectionFactory.Create();
        var cmd = new CommandDefinition(RegistryQueries.GetAllTransmissionStations, cancellationToken: ct);
        var rows = await connection.QueryAsync<TransmissionStation>(cmd);
        return rows.AsList();
    }

    public async Task<IReadOnlyList<Substation>> GetSubstationsAsync(CancellationToken ct = default)
    {
        using var connection = _connectionFactory.Create();
        var cmd = new CommandDefinition(RegistryQueries.GetAllSubstations, cancellationToken: ct);
        var rows = await connection.QueryAsync<Substation>(cmd);
        return rows.AsList();
    }

    public async Task<IReadOnlyList<DistributionSubstation>> GetDistributionSubstationsAsync(CancellationToken ct = default)
    {
        using var connection = _connectionFactory.Create();
        var cmd = new CommandDefinition(RegistryQueries.GetAllDistributionSubstations, cancellationToken: ct);
        var rows = await connection.QueryAsync<DistributionSubstation>(cmd);
        return rows.AsList();
    }

    public async Task<IReadOnlyList<DistributionSubstation>> GetDistributionSubstationsByFeederIdsAsync(
        IEnumerable<int> feederIds, CancellationToken ct = default)
    {
        var ids = feederIds.ToArray();
        if (ids.Length == 0)
            return Array.Empty<DistributionSubstation>();

        using var connection = _connectionFactory.Create();
        var cmd = new CommandDefinition(
            RegistryQueries.GetDistributionSubstationsByFeederIds,
            new { FeederIds = ids },
            cancellationToken: ct);

        var rows = await connection.QueryAsync<DistributionSubstation>(cmd);
        return rows.AsList();
    }
}