using Hack2on.Core.DTOs.TransmissionStationDTOs;

namespace Hack2on.Core.Abstractions.Services
{
    public interface ITransmissionStationService
    {
        Task<IReadOnlyList<GetAllTransmissionStationsDTO>> GetAllAsync(CancellationToken ct);
    }
}
