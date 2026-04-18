using Hack2on.Core.Abstractions;
using Hack2on.Core.Common;
using Hack2on.Core.Models;
using Microsoft.Extensions.Caching.Memory;

namespace Hack2on.Analysis;

public sealed class CachedAnomalyDetector : IAnomalyDetector
{
    private readonly NtlDetectionPipeline _inner;
    private readonly IMemoryCache _cache;
    private readonly AnalysisConfig _config;

    public CachedAnomalyDetector(
        NtlDetectionPipeline inner,
        IMemoryCache cache,
        AnalysisConfig config)
    {
        _inner = inner;
        _cache = cache;
        _config = config;
    }

    public Task<IReadOnlyList<FeederAnomalyResult>> DetectAsync(
        DateTime from, DateTime to, CancellationToken ct = default)
    {
        var key = $"detect:{from:o}:{to:o}";
        return _cache.GetOrCreateAsync(key, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow =
                TimeSpan.FromMinutes(_config.CacheDurationMinutes);
            return await _inner.DetectAsync(from, to, ct);
        })!;
    }

    public Task<NtlSummary> GetSummaryAsync(
        DateTime from, DateTime to, CancellationToken ct = default)
    {
        var key = $"summary:{from:o}:{to:o}";
        return _cache.GetOrCreateAsync(key, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow =
                TimeSpan.FromMinutes(_config.CacheDurationMinutes);
            return await _inner.GetSummaryAsync(from, to, ct);
        })!;
    }
}