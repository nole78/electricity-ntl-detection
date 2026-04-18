namespace Hack2on.Core.Entities
{
    public sealed class Feeder11
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int? SsId { get; set; }   // Substation (11 kV side) Denormalizacija
        public int? MeterId { get; set; }     
        public int? Feeder33Id { get; set; }
        public int? NameplateRating { get; set; }
        public int? TsId { get; set; }
    }
}
