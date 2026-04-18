using Hack2on.Core.Abstractions;
using Hack2on.Core.Common;
using Microsoft.AspNetCore.Mvc;

namespace Hack2on.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class FeedersController : ControllerBase
{
    private readonly IAnomalyDetector _detector;
    private readonly IMeterReadRepository _meterReadRepository;
    private readonly AnalysisConfig _config;
    private static readonly DateTime DatasetEnd = new(2026, 4, 16);

    public FeedersController(
        IAnomalyDetector detector,
        IMeterReadRepository meterReadRepository,
        AnalysisConfig config)
    {
        _detector = detector;
        _meterReadRepository = meterReadRepository;
        _config = config;
    }

    /// <summary>
    /// Returns every analyzable Feeder11 with its anomaly classification.
    /// Normal feeders included — frontend filters client-side.
    /// Sorted most-anomalous first.
    /// </summary>
    [HttpGet("anomalies")]
    public async Task<IActionResult> GetAnomalies(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        CancellationToken ct)
    {
        var (start, end) = ResolveWindow(from, to);
        var results = await _detector.DetectAsync(start, end, ct);
        return Ok(results);
    }

    /// <summary>
    /// Hourly load profile for one feeder  drill-down chart data.
    /// </summary>
    [HttpGet("{id:int}/load-profile")]
    public async Task<IActionResult> GetLoadProfile(
        int id,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        CancellationToken ct)
    {
        var (start, end) = ResolveWindow(from, to);
        var points = await _meterReadRepository.GetFeederLoadProfileAsync(id, start, end, ct);

        if (points.Count == 0)
            return NotFound(new { message = $"No load data for feeder {id} in window." });

        return Ok(points);
    }

    private (DateTime Start, DateTime End) ResolveWindow(DateTime? from, DateTime? to)
    {
        var end = to ?? DatasetEnd;
        var start = from ?? end - _config.DefaultWindow;
        return (start, end);
    }
}