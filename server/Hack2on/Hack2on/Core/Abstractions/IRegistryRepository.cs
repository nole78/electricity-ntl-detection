using Hack2on.Core.Entities;

namespace Hack2on.Core.Abstractions
{
    public interface IRegistryRepository
    {
        Task<IReadOnlyList<TransmissionStation>> GetTransmissionStationsAsync(CancellationToken ct = default);
        Task<IReadOnlyList<Substation>> GetSubstationsAsync(CancellationToken ct = default);
        Task<IReadOnlyList<DistributionSubstation>> GetDistributionSubstationsAsync(CancellationToken ct = default);

        Task<IReadOnlyList<DistributionSubstation>> GetDistributionSubstationsByFeederIdsAsync(
            IEnumerable<int> feederIds, CancellationToken ct = default);
    }

}
