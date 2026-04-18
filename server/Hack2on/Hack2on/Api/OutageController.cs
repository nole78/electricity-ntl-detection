using Hack2on.Core.Abstractions.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hack2on.Api
{
    [ApiController]
    [Route("api/outages")]
    public class OutagesController(IOutageService outageService) : ControllerBase
    {
        private readonly IOutageService _outageService = outageService;

        [HttpGet]
        [Route("/history")]
        public async Task<IActionResult> GetAllPast()
        {
            var result = await _outageService.GetAllPastOutagesAsync();
            return Ok(result);
        }

        [HttpGet]
        [Route("/current")]
        public async Task<IActionResult> GetAllCurrent()
        {
            var result = await _outageService.GetAllCurrentOutagesAsync();
            return Ok(result);
        }
    }
}