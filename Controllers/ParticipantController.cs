using CodeEditor.Models;
using CodeEditor.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using CodeEditor.Models;
using CodeEditor.Services;

namespace CodeEditor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParticipantController : Controller
    {

        private readonly ParticipantService _ParticipantService;

        public ParticipantController(ParticipantService ParticipantsService) =>
            _ParticipantService = ParticipantsService;

        [HttpGet]
        public async Task<List<Participant>> Get() =>
            await _ParticipantService.GetAsync();


        [HttpPost]
        public async Task<IActionResult> Post(Participant newParticipant)
        {
            await _ParticipantService.CreateAsync(newParticipant);

            return CreatedAtAction(nameof(Get), new { id = newParticipant._id }, newParticipant);
        }



    }
}
