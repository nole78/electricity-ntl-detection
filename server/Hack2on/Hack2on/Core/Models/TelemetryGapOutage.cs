namespace Hack2on.Core.Models
{
    public class TelemetryGapOutage
    {
        public int MeterId { get; set; }
        public DateTime? PowerLostTime { get; set; }
        public DateTime PowerRestoredTime { get; set; }
        public int OutageDurationMinutes { get; set; }
    }
}
