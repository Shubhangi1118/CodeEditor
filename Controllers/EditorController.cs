using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Main.Models;
using Main.Supervisor;

namespace CodeEditor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EditorController : Controller
    {
        private readonly EditorSupervisor _EditorSupervisor;

        public EditorController(EditorSupervisor EditorsSupervisor) =>
            _EditorSupervisor = EditorsSupervisor;

        [HttpGet]
        public async Task<List<EditorData>> Get()=>
        
            await _EditorSupervisor.GetEditorAsync();
            

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<EditorData>> Get(string id)
        {
            var question = await _EditorSupervisor.GetEditorAsync(id);

            if (question is null)
            {
                return NotFound();
            }

            return question;
        }

        [HttpPost]
        public async Task<IActionResult> Post(EditorData newQuestion)
        {
            await _EditorSupervisor.CreateEditorAsync(newQuestion);

            return CreatedAtAction(nameof(Get), new { id = newQuestion._id }, newQuestion);
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _EditorSupervisor.RemoveEditorAsync(id);

            return NoContent();
        }

    }
}
