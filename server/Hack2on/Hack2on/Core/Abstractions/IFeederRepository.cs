using Hack2on.Core.Entities;

namespace Hack2on.Core.Abstractions
{
    public interface IFeederRepository
    {
        Task<IReadOnlyList<Feeder11>> GetAllFeeder11Async(CancellationToken ct = default);

        Task<Feeder11?> GetFeeder11ByIdAsync(int id, CancellationToken ct = default);

        /// <summary>
        /// Count of DistributionSubstations linked to each Feeder11
        /// Keyed by Feeder11Id
        /// </summary>
        Task<IReadOnlyDictionary<int, int>> GetDtCountsPerFeederAsync(CancellationToken ct = default);

        /// <summary>
        /// All DistributionSubstations under a given Feeder11 (for  details view)
        /// </summary>
        Task<IReadOnlyList<DistributionSubstation>> GetDtsForFeederAsync(
            int feeder11Id, CancellationToken ct = default);
    }
}
