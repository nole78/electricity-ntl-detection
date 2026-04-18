namespace Hack2on.Core.Models
{
    public enum AnomalyClassification
    {
        /// <summary>Within expected range no action needed</summary>
        Normal,

        /// <summary>
        /// Load significantly above expected likely unmetered/illegal connections
        /// drawing from the feeder without being registered.
        /// </summary>
        TheftSuspected,

        /// <summary>
        /// Load significantly below expected registered consumers appear inactive.
        /// Likely dead meters ghost consumers or disconnected without record.
        /// </summary>
        GhostOrDeadMeters
    }
}
