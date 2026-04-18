namespace Hack2on.Core.Models
{
    /// <summary>Single timebucket energy point for plotting a feeder load curve</summary>
    public sealed class FeederLoadPoint
    {
        public DateTime Timestamp { get; init; }
        public double EnergyKwh { get; init; }
    }
}
