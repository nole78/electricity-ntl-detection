namespace Hack2on.Core.Models
{
    public class ActiveTelemetryOutage
    {
        public int MeterId { get; set; }
        public DateTime DetectedAt { get; set; }
        public int OutageDurationMinutes { get; set; }
    }
}
