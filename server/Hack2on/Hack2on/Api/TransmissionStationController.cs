using Microsoft.AspNetCore.Mvc;
using Hack2on.Core.Abstractions.Services;
using Hack2on.Core.DTOs.TransmissionStationDTOs;

namespace Hack2on.Api
{
    [ApiController]
    [Route("api/transmission-stations")]
    public class TransmissionStationController(ITransmissionStationService service) : ControllerBase
    {
        private readonly ITransmissionStationService _service = service;

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<GetAllTransmissionStationsDTO>>> GetAll(CancellationToken ct)
        {
            var transmissionStations = await _service.GetAllAsync(ct);
            return Ok(transmissionStations);
        }
    }
}
