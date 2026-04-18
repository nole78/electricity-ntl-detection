using Hack2on.Core.Models;

namespace Hack2on.Core.Abstractions
{
    public interface IMeterReadRepository
    {
        /// <summary>
        /// For every Feeder11, compute the total energy (kWh) delivered through its head meter
        /// between (from to) Uses hourly deltas
        /// of the cumulative register X MultiplierFactor.
        /// </summary>
        Task<IReadOnlyList<FeederLoadSnapshot>> GetFeederLoadSnapshotsAsync(
            DateTime from, DateTime to, CancellationToken ct = default);

        /// <summary>
        /// Hourly energy points for one feeder for the load-profile chart endpoint.
        /// </summary>
        Task<IReadOnlyList<FeederLoadPoint>> GetFeederLoadProfileAsync(
            int feeder11Id, DateTime from, DateTime to, CancellationToken ct = default);
    }
}
