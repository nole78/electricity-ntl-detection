using Hack2on.Core.Abstractions;
using Hack2on.Core.Abstractions.Services;
using Hack2on.Core.DTOs.TransmissionStationDTOs;

namespace Hack2on.Infrastructure.ServiceImplementation
{
    public class TransmissionStationService(ITransmissionStationRepository repository) : ITransmissionStationService
    {
        private readonly ITransmissionStationRepository _repository = repository;

        public async Task<IReadOnlyList<GetAllTransmissionStationsDTO>> GetAllAsync(CancellationToken ct)
        {
            var transmissionStations = await _repository.GetAllTransmissionStationsAsync(ct);
            return transmissionStations
                .Select(ts => new GetAllTransmissionStationsDTO
                {
                    Name = ts.Name,
                    Latitude = ts.Latitude,
                    Longitude = ts.Longitude
                }).ToList().AsReadOnly();
        }
    }
}
