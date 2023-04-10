using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using CodeEditor.Models;
using CodeEditor.Services;

namespace CodeEditor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EditorController : Controller
    {
        private readonly EditorService _EditorService;

        public EditorController(EditorService EditorsService) =>
            _EditorService = EditorsService;

        [HttpGet]
        public async Task<List<Editor>> Get() =>
            await _EditorService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Editor>> Get(string id)
        {
            var contest = await _EditorService.GetAsync(id);

            if (contest is null)
            {
                return NotFound();
            }

            return contest;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Editor newContest)
        {
            await _EditorService.CreateAsync(newContest);

            return CreatedAtAction(nameof(Get), new { id = newContest._id }, newContest);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Editor updatedContest)
        {
            var user = await _EditorService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            updatedContest._id = user._id;

            await _EditorService.UpdateAsync(id, updatedContest);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var contest = await _EditorService.GetAsync(id);

            if (contest is null)
            {
                return NotFound();
            }

            await _EditorService.RemoveAsync(id);

            return NoContent();
        }

    }
}
