using Hack2on.Core.Models;

namespace Hack2on.Core.Abstractions.Services
{
    public interface IOutageService
    {
        Task<List<OutageInfo>> GetAllPastOutagesAsync();
        Task<List<OutageInfo>> GetAllCurrentOutagesAsync();
    }
}
