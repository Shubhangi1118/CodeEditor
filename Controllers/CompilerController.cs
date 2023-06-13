using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using Main.Models;
using Main.Supervisor;
using System.Threading.Tasks;
using MongoDB.Bson.IO;

namespace CodeEditor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class CompilerController : ControllerBase
    {
        private readonly ResultSupervisor _ResultSupervisor;

        public CompilerController(ResultSupervisor ResultsSupervisor) =>
            _ResultSupervisor = ResultsSupervisor;

        [HttpGet]
        public async Task<List<ResultData>> Get() =>
            await _ResultSupervisor.GetResultAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<ResultData>> Get(string id)
        {
            var participant = await _ResultSupervisor.GetResultAsync(id);

            if (participant is null)
            {
                return NotFound();
            }
            return participant;
        }
        
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CodeInput codeInput)
        {
            var response = await _ResultSupervisor.CreateResultAsync(codeInput);
            return Content(response);
        }
    }
}
