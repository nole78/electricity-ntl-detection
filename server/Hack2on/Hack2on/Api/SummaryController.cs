using Hack2on.Core.Abstractions;
using Hack2on.Core.Common;
using Microsoft.AspNetCore.Mvc;

namespace Hack2on.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class SummaryController : ControllerBase
{
    private readonly IAnomalyDetector _detector;
    private readonly AnalysisConfig _config;

    private static readonly DateTime DatasetEnd = new(2026, 4, 16);

    public SummaryController(IAnomalyDetector detector, AnalysisConfig config)
    {
        _detector = detector;
        _config = config;
    }

    /// <summary>
    /// Dashboard KPIs: totals, counts by classification, top 10 offenders,
    /// estimated NTL energy and percentage.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetSummary(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        CancellationToken ct)
    {
        var end = to ?? DatasetEnd;
        var start = from ?? end - _config.DefaultWindow;

        var summary = await _detector.GetSummaryAsync(start, end, ct);
        return Ok(summary);
    }
}