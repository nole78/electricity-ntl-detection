namespace Hack2on.Core.Models
{
    public sealed record FeederCoverage(
        int TotalFeeders,
        int FeedersWithHeadMeter,
        int FeedersWithAtLeastOneDt);
}
