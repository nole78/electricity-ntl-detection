namespace Hack2on.Core.Models
{
    public enum OutageType
    {
        TelemetryGap,
        ActiveTelemetryOutage,
        ZeroVoltage,
        NoTelemetry
    }

    public class OutageInfo
    {
        public int MeterId { get; set; }
        public DateTime? DetectedAt { get; set; }
        public string Description { get; set; } = string.Empty;
        public int? DtId { get; set; }
        public string? DtName { get; set; }
        public int? Feeder11Id { get; set; }
        public string? Feeder11Name { get; set; }
        public int? SubstationId { get; set; }
        public string? SubstationName { get; set; }
        public int? Feeder33Id { get; set; }
        public string? Feeder33Name { get; set; }
        public int? TransmissionStationId { get; set; }
        public string? TransmissionStationName { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public OutageType OutageType { get; set; }
    }
}


