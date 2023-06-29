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
        //Dependency injection of EditorSupervisor
        private readonly EditorSupervisor _EditorSupervisor;

        public EditorController(EditorSupervisor EditorsSupervisor) =>
            _EditorSupervisor = EditorsSupervisor;

        [HttpGet]
        // Getting the array of questions
        public async Task<List<EditorData>> Get()=>
        
            await _EditorSupervisor.GetEditorAsync();
            
        //Getting the Question with the given id and returning question
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
        //Updating the question value in the database
        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, EditorData updatedQuestion)
        {
            await _EditorSupervisor.UpdateEditorAsync(id, updatedQuestion);

            return NoContent();
        }


        [HttpPost]
        //Creating a new question in the database
        public async Task<IActionResult> Post(EditorData newQuestion)
        {
            await _EditorSupervisor.CreateEditorAsync(newQuestion);

            return CreatedAtAction(nameof(Get), new { id = newQuestion._id }, newQuestion);
        }

        [HttpDelete("{id:length(24)}")]
        // Deleting the question from the database with the given id
        public async Task<IActionResult> Delete(string id)
        {
            await _EditorSupervisor.RemoveEditorAsync(id);

            return NoContent();
        }

    }
}
