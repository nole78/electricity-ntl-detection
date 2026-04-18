using Hack2on.Core.Abstractions;
using Hack2on.Core.Abstractions.Services;
using Hack2on.Core.Models;

namespace Hack2on.Infrastructure.ServiceImplementation
{
    public class OutageService(IOutageRepository outageRepository, IFeederRepository feederRepository) : IOutageService
    {
        private readonly IOutageRepository _outageRepository = outageRepository;
        private readonly IFeederRepository _feederRepository = feederRepository;

        public async Task<List<OutageInfo>> GetAllCurrentOutagesAsync()
        {
            var result = new List<OutageInfo>();

            var currentOutages = (await _outageRepository.GetZeroVoltageOrNoTelemetryAsync()).ToList();
            var activeTelemetryOutages = (await _outageRepository.GetActiveTelemetryOutagesAsync()).ToList();

            var meterLocations = (await _feederRepository.GetAllFeeder11Async()).ToList();

            var feederByMeterId = meterLocations
                    .Where(x => x.MeterId.HasValue)
                    .GroupBy(x => x.MeterId!.Value)
                    .ToDictionary(g => g.Key, g => g.First());

            foreach (var current in currentOutages)
            {
                feederByMeterId.TryGetValue(current.MeterId, out var feeder11);

                result.Add(new OutageInfo
                {
                    MeterId = current.MeterId,
                    DetectedAt = current.ReadTimestamp ?? DateTime.MinValue,
                    Description = current.OutageReason switch
                    {
                        "Zero voltage" => $"Zero voltage detected at station '{current.StationName}'.",
                        "No telemetry" => $"No telemetry available for meter at station '{current.StationName}'.",
                        _ => $"Outage detected at station '{current.StationName}'."
                    },
                    OutageType = current.OutageReason == "Zero voltage" ? OutageType.ZeroVoltage : OutageType.NoTelemetry,
                    Feeder11Id = feeder11?.Id,
                    Feeder11Name = feeder11?.Name,
                    SubstationId = feeder11?.SsId,
                    Feeder33Id = feeder11?.Feeder33Id,
                    TransmissionStationId = feeder11?.TsId
                });
            }

            foreach (var active in activeTelemetryOutages)
            {
                feederByMeterId.TryGetValue(active.MeterId, out var feeder11);

                result.Add(new OutageInfo
                {
                    MeterId = active.MeterId,
                    DetectedAt = active.DetectedAt,
                    Description = $"Telemetry still missing. Last read was {active.OutageDurationMinutes} minutes ago.",
                    OutageType = OutageType.ActiveTelemetryOutage,

                    Feeder11Id = feeder11?.Id,
                    Feeder11Name = feeder11?.Name,
                    SubstationId = feeder11?.SsId,
                    Feeder33Id = feeder11?.Feeder33Id,
                    TransmissionStationId = feeder11?.TsId
                });
            }

            return result
                .OrderByDescending(x => x.DetectedAt)
                .Take(100)
                .ToList();
        }

        public async Task<List<OutageInfo>> GetAllPastOutagesAsync()
        {
            var result = new List<OutageInfo>();

            var telemetryGapOutages = (await _outageRepository.GetTelemetryGapOutagesAsync()).ToList();

            var meterLocations = (await _feederRepository.GetAllFeeder11Async()).ToList();

            var feederByMeterId = meterLocations
                    .Where(x => x.MeterId.HasValue)
                    .GroupBy(x => x.MeterId!.Value)
                    .ToDictionary(g => g.Key, g => g.First());

            foreach (var gap in telemetryGapOutages)
            {
                feederByMeterId.TryGetValue(gap.MeterId, out var feeder11);

                result.Add(new OutageInfo
                {
                    MeterId = gap.MeterId,
                    DetectedAt = gap.PowerLostTime ?? gap.PowerRestoredTime,
                    Description = $"Telemetry gap detected. Power restored at {gap.PowerRestoredTime:yyyy-MM-dd HH:mm:ss}. Duration: {gap.OutageDurationMinutes} minutes.",
                    OutageType = OutageType.TelemetryGap,
                    Feeder11Id = feeder11?.Id,
                    Feeder11Name = feeder11?.Name,
                    SubstationId = feeder11?.SsId,
                    Feeder33Id = feeder11?.Feeder33Id,
                    TransmissionStationId = feeder11?.TsId
                });
            }

            
            return result
                .OrderByDescending(x => x.DetectedAt)
                .Take(100)
                .ToList();
        }
    }
}