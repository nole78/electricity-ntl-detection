namespace Hack2on.Core.Entities
{
    public sealed class MeterReadTfe
    {
        public long Id { get; set; }
        public int Mid { get; set; }   
        public double Val { get; set; }
        public DateTime Ts { get; set; }
    }
}
