using Hack2on.Core.DTOs.SubstationDTOs;

namespace Hack2on.Core.Abstractions.Services
{
    public interface ISubstationService
    {
        Task<IReadOnlyList<GetAllSubstationsDTO>> GetAllAsync(CancellationToken ct);
    }
}
