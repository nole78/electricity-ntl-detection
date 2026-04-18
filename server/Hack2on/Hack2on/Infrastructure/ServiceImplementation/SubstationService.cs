using Hack2on.Core.Abstractions;
using Hack2on.Core.Abstractions.Services;
using Hack2on.Core.DTOs.SubstationDTOs;

namespace Hack2on.Infrastructure.ServiceImplementation
{
    public class SubstationService(ISubstationRepository repository) : ISubstationService
    {
        private readonly ISubstationRepository _repository = repository;
        public async Task<IReadOnlyList<GetAllSubstationsDTO>> GetAllAsync(CancellationToken ct)
        {
            var substations = await _repository.GetAllSubstationsAsync(ct);
            return substations
                .Select(ts => new GetAllSubstationsDTO()
                {
                    Name = ts.Name,
                    Latitude = ts.Latitude,
                    Longitude = ts.Longitude
                }).ToList().AsReadOnly();
        }
    }
}
