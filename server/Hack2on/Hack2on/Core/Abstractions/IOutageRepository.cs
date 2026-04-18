using Hack2on.Core.Models;

namespace Hack2on.Core.Abstractions
{
    public interface IOutageRepository
    {
        Task<IEnumerable<TelemetryGapOutage>> GetTelemetryGapOutagesAsync();
        Task<IEnumerable<CurrentOutageStatus>> GetZeroVoltageOrNoTelemetryAsync();
        Task<IEnumerable<ActiveTelemetryOutage>> GetActiveTelemetryOutagesAsync();
    }
}
