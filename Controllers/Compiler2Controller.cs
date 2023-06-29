using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using Main.Models;
using Main.Supervisor;
using System.Threading.Tasks;

namespace CodeEditor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class Compiler2Controller : ControllerBase
    {
        //Dependency injection of CompilerRunSupervisor
        private readonly CompilerRunSupervisor _CompilerRunSupervisor;

        public Compiler2Controller(CompilerRunSupervisor CompilerRunsSupervisor) =>
            _CompilerRunSupervisor = CompilerRunsSupervisor;

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CodeInput2 codeInput)
        {
            //using the Run method of CompilerRunSupervisor to get the output
            var output = await _CompilerRunSupervisor.Run(codeInput);
            return Ok(output);// returning the ouput to the frontend
        }

    }

}