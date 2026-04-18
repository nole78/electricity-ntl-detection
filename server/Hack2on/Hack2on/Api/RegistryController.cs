using Hack2on.Core.Abstractions;
using Hack2on.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Hack2on.Controllers;

[ApiController]
[Route("api")]
public sealed class RegistryController : ControllerBase
{
    private readonly IRegistryRepository _registry;

    public RegistryController(IRegistryRepository registry)
    {
        _registry = registry;
    }

    [HttpGet("transmission-stations")]
    public async Task<IActionResult> GetTransmissionStations(CancellationToken ct)
        => Ok(await _registry.GetTransmissionStationsAsync(ct));

    [HttpGet("substations")]
    public async Task<IActionResult> GetSubstations(CancellationToken ct)
        => Ok(await _registry.GetSubstationsAsync(ct));


    [HttpGet("distribution-substations")]
    public async Task<IActionResult> GetDistributionSubstations(
        [FromQuery] string? feederIds,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(feederIds))
            return Ok(await _registry.GetDistributionSubstationsAsync(ct));

        var ids = feederIds
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(s => int.TryParse(s.Trim(), out var v) ? v : -1)
            .Where(v => v > 0)
            .ToArray();

        return Ok(await _registry.GetDistributionSubstationsByFeederIdsAsync(ids, ct));
    }
}