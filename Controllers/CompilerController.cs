using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
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
        public class CodeInput
        {
            public string code { get; set; }
            public string language { get; set; }
        }
        [HttpPost]
        
        public IActionResult Post([FromBody] CodeInput codeInput)
        {
            try
            {

                string code = codeInput.code;
                string language = codeInput.language;
                // Generate a unique file name
                if(language =="C++")
                {
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
                            FileName = $"{Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles", $"{Path.GetFileNameWithoutExtension(filePath)}.exe")}", // Execute the compiled executable

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
                else if (language == "Python")
                {
                    var fileName = $"{Guid.NewGuid().ToString("N")}.py";

                    // Get the path to the directory where the file will be saved
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles", fileName);

                    // Create the directory if it doesn't exist
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    // Write the code to the file
                    System.IO.File.WriteAllText(filePath, code);

                    // Execute the code using python
                    var executeProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = "python", // Use python directly without specifying the full path
                            Arguments = fileName,
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
                        streamWriter.WriteLine(language);
                    }

                    var output = executeProcess.StandardOutput.ReadToEnd();
                    executeProcess.WaitForExit();

                    // Return the output of the executed code
                    return Ok(new { FileName = fileName, FilePath = filePath, Output = output });
                }
                else if (language == "Java")
                {
                    string className = "";
                    using (var reader = new StringReader(code))
                    {
                        string line;
                        while ((line = reader.ReadLine()) != null)
                        {
                            if (line.Trim().StartsWith("public class"))
                            {
                                className = line.Trim().Substring("public class".Length).Trim().Split(' ')[0];
                                break;
                            }
                        }
                    }
                    var fileName = $"{className}.java";

                    // Save the Java code to the file using the new filename
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles", fileName);
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                    System.IO.File.WriteAllText(filePath, code);

                    // Compile the code using javac compiler
                    var compileProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = "javac", // Use javac directly without specifying the full path
                            Arguments = fileName,
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
                            FileName = "java", // Use java directly without specifying the full path
                            Arguments = $"{Path.GetFileNameWithoutExtension(fileName)}",
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

                else
                {
                    return BadRequest($"Unsupported programming language: {language}");
                }


            }

            catch (Exception ex)
            {
                // Return an error response if something goes wrong
                return BadRequest(ex.Message);
            }

        }
    }
}
