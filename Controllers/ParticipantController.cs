
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
        //Dependency injection of ParticipantSupervisor
        private ParticipantSupervisor _ParticipantSupervisor;

        public ParticipantController(ParticipantSupervisor ParticipantsSupervisor) =>
            _ParticipantSupervisor = ParticipantsSupervisor;

        [HttpGet]
        //Getting the participants array from the database 
        public async Task<List<ParticipantData>> Get()=>
            await _ParticipantSupervisor.GetParticipantAsync();

        [HttpGet("{id:length(24)}")]
        //Getting the participant value from database with teh given value
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
        // creating a new participant in the database
        public async Task<IActionResult> Post(ParticipantData newParticipant)
        {
         await _ParticipantSupervisor.CreateParticipantAsync(newParticipant);
            return CreatedAtAction(nameof(Get), new { id = newParticipant._id }, newParticipant);
        }

    }
}
