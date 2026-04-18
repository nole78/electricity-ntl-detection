using Hack2on.Core.Entities;

namespace Hack2on.Core.Abstractions
{
    public interface ITransmissionStationRepository
    {
        Task<IReadOnlyList<TransmissionStation>> GetAllTransmissionStationsAsync(CancellationToken ct);
    }
}
