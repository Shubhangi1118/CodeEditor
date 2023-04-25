using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics;
using System.IO;
using System.Text;

namespace CodeEditor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompilerController : ControllerBase
    {
        [HttpPost]
        public IActionResult Post()
        {
            try
            {
                var jsonData = "";
                using(StreamReader reader = new StreamReader(Request.Body,Encoding.UTF8)) {
                    jsonData = reader.ReadToEndAsync().Result;
                }
                string code = jsonData;
                // Generate a unique file name
                var fileName = $"{Guid.NewGuid().ToString("N")}.cpp";

                // Get the path to the directory where the file will be saved
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles", fileName);

                // Create the directory if it doesn't exist
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                // Write the code to the file
                System.IO.File.WriteAllText(filePath, code);

                // Compile the code using g++ compiler
                var compileProcess = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "g++", // Use g++ directly without specifying the full path
                        Arguments = $"{fileName} -o {Path.GetFileNameWithoutExtension(filePath)}.exe", 
                        WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };

                compileProcess.Start();
                compileProcess.WaitForExit();

                if (compileProcess.ExitCode != 0)
                {
                    // Compilation failed
                    var compileErrorMessage = compileProcess.StandardError.ReadToEnd();
                    return BadRequest($"Compilation failed: {compileErrorMessage}");
                }

                // Execute the compiled code
                var executeProcess = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = $"{Path.GetFileNameWithoutExtension(filePath)}", // Execute the compiled executable
                        WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),
                        RedirectStandardOutput = true,

                        RedirectStandardInput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = false
                    }
                };

                executeProcess.Start();

                // Write input to the standard input of the executed code
                using (var streamWriter = executeProcess.StandardInput)
                {
                    streamWriter.WriteLine("Input data"); // Replace this with your actual input data
                }

                var output = executeProcess.StandardOutput.ReadToEnd();
                executeProcess.WaitForExit();

                // Return the output of the executed code
                return Ok(new { FileName = fileName, FilePath = filePath, Output = output });
            }
            catch (Exception ex)
            {
                // Return an error response if something goes wrong
                return BadRequest(ex.Message);
            }
        }
    }
}
