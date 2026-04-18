using Microsoft.AspNetCore.Mvc;
using Hack2on.Core.Abstractions.Services;
using Hack2on.Core.DTOs.SubstationDTOs;

namespace Hack2on.Api
{
    [ApiController]
    [Route("api/substations")]
    public class SubstationControlller(ISubstationService service) : ControllerBase
    {
        private readonly ISubstationService _service = service;

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<GetAllSubstationsDTO>>> GetAll(CancellationToken ct)
        {
            var substations = await _service.GetAllAsync(ct);
            return Ok(substations);
        }
    }
}
