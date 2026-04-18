namespace Hack2on.Core.Entities
{
    public sealed class Substation
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}
