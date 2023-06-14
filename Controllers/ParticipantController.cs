
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Main.Supervisor;
using Main.Models;
using System.Globalization;

namespace CodeEditor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParticipantController : Controller
    {

        private ParticipantSupervisor _ParticipantSupervisor;

        public ParticipantController(ParticipantSupervisor ParticipantsSupervisor) =>
            _ParticipantSupervisor = ParticipantsSupervisor;

        [HttpGet]
        public async Task<List<ParticipantData>> Get()=>
            await _ParticipantSupervisor.GetParticipantAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<ParticipantData>> Get(string id)
        {
            var participant = await _ParticipantSupervisor.GetParticipantAsync(id);

            if (participant is null)
            {
                return NotFound();
            }

            return participant;
        }

        [HttpPost]
        public async Task<IActionResult> Post(ParticipantData newParticipant)
        {
         await _ParticipantSupervisor.CreateParticipantAsync(newParticipant);
            return CreatedAtAction(nameof(Get), new { id = newParticipant._id }, newParticipant);
        }

    }
}
