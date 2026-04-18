using Hack2on.Core.Entities;

namespace Hack2on.Core.Abstractions
{
    public interface ISubstationRepository
    {
        Task<IReadOnlyList<Substation>> GetAllSubstationsAsync(CancellationToken ct);
    }
}
