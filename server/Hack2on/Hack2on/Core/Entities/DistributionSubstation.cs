namespace Hack2on.Core.Entities
{
    public class DistributionSubstation
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int? MeterId { get; set; }
        public int? Feeder11Id { get; set; }
        public int? Feeder33Id { get; set; }
        public int? NameplateRating { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}
