namespace Hack2on.Core.Entities
{
    /// <summary>
    /// Secondary channel reading (V or A per phase).
    /// Not used in Path A kept for Path B future work if we later get classification
    /// </summary>
    public sealed class MeterRead
    {
        public long Id { get; set; }
        public int Mid { get; set; }
        public double Val { get; set; }
        public DateTime Ts { get; set; }
        public int Cid { get; set; }
    }
}
