namespace Hack2on.Core.Models
{
    public class CurrentOutageStatus
    {
        public string StationType { get; set; } = string.Empty;
        public string StationName { get; set; } = string.Empty;
        public int MeterId { get; set; }
        public string MeterSerialNumber { get; set; } = string.Empty;
        public decimal? ReadValue { get; set; }
        public DateTime? ReadTimestamp { get; set; }
        public string? ChannelName { get; set; }
        public string? Unit { get; set; }
        public string OutageReason { get; set; } = string.Empty;
    }
}