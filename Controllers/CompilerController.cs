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
        //dependency injection of ResultSupervisor
        private readonly ResultSupervisor _ResultSupervisor;

        public CompilerController(ResultSupervisor ResultsSupervisor) =>
            _ResultSupervisor = ResultsSupervisor;

        [HttpGet]
        // using the GetResultAsync method of ResultSupervisor to get the array of Results
        public async Task<List<ResultData>> Get() =>
            await _ResultSupervisor.GetResultAsync();

        [HttpGet("{id:length(24)}")]
        //getting the result with given id and returning it
        public async Task<ActionResult<ResultData>> Get(string id)
        {
            var result = await _ResultSupervisor.GetResultAsync(id);

            if (result is null)
            {
                return NotFound();
            }
            return result;
        }
        
        [HttpPost]
        //sending the code and otehr parameters for execution
        public async Task<IActionResult> Post([FromBody] CodeInput codeInput)
        {
            var response = await _ResultSupervisor.CreateResultAsync(codeInput);
            return Content(response);
        }
    }
}
