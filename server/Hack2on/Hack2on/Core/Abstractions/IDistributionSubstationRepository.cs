using Hack2on.Core.Entities;

namespace Hack2on.Core.Abstractions
{
    public interface IDistributionSubstationRepository
    {
        Task<IReadOnlyList<DistributionSubstation>> GetAllDistributionSubstationAsync(CancellationToken ct = default);
    }
}
