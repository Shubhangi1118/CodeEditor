using Main.Models;
using MongoDB.Bson.IO;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Main.Supervisor
{
    public class CompilerRunSupervisor
    {
        public async Task<string> Run(CodeInput2 codeInput)
        {
            try
            {
                //getting the code,language and testcase values 
                string code = codeInput.code;
                string language = codeInput.language;
                List<string> testcase = codeInput.testcase;
                // Generate a unique file name
                if (language == "C++")
                {
                    //getting a unique file name with proper extension
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
                            Arguments = $"{fileName} -o {Path.GetFileNameWithoutExtension(filePath)}",//specifying the file to be compiled and the name of the executable file created
                            WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),//specifying the working directory while the file is compiled
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        }
                    };

                    compileProcess.Start();//starting compiling 
                    compileProcess.WaitForExit();//waiting for the compilation of the file to be finished

                    if (compileProcess.ExitCode != 0)
                    {
                        // Compilation failed
                        var compileErrorMessage = compileProcess.StandardError.ReadToEnd();
                        return compileErrorMessage;
                    }

                    // Execute the compiled code
                    var executeProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = $"{Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles", $"{Path.GetFileNameWithoutExtension(filePath)}")}", // Execute the compiled executable

                            RedirectStandardOutput = true,

                            RedirectStandardInput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = false
                        }
                    };

                    executeProcess.Start();//running the executable file

                    // Write input to the standard input of the executed code
                    using (var streamWriter = executeProcess.StandardInput)
                    {
                        // Write each input variable to a new line
                        foreach (var value in testcase)
                        {
                            streamWriter.WriteLine(value);
                        }
                    }

                    var output = executeProcess.StandardOutput.ReadToEnd();// storing the ouput
                    executeProcess.WaitForExit();

                    // Return the output of the executed code
                    return output;
                }
                else if (language == "Python")
                {
                    //getting teh unique file name with the proper extension
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
                            Arguments = fileName,//specifying the name of teh file to be interpreted 
                            WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),//specifying the working directory while the file is interpreted
                            RedirectStandardOutput = true,
                            RedirectStandardInput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = false
                        }
                    };

                    executeProcess.Start();//starting interpreting the code

                    // Write input to the standard input of the executed code
                    using (var streamWriter = executeProcess.StandardInput)
                    {
                        // Write each input variable to a new line
                        foreach (var value in testcase)
                        {
                            streamWriter.WriteLine(value);
                        }
                    }
                    var output = executeProcess.StandardOutput.ReadToEnd();
                    executeProcess.WaitForExit();//waiting for the code interpreting to be finished

                    // Return the output of the executed code
                    return output;
                }
                else if (language == "Java")
                {
                    string className = "";//initialising className with empty string
                    using (var reader = new StringReader(code))// reading code line by line
                    {
                        string line;
                        while ((line = reader.ReadLine()) != null)
                        {
                            if (line.Trim().StartsWith("public class"))// if the line starts with public class 
                            {
                                className = line.Trim().Substring("public class".Length).Trim().Split(' ')[0];// the public class keyword and all the spaces are moved to get the classname
                                break;
                            }
                        }
                    }
                    var fileName = $"{className}.java";//giving the file the name of the class with proper extensions

                    // Save the Java code to the file using the new filename
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles", fileName);
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));// if the directory doesn't already exist
                    System.IO.File.WriteAllText(filePath, code);

                    // Compile the code using javac compiler
                    var compileProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = "javac", // Use javac directly without specifying the full path
                            Arguments = fileName,// passing the file name to be compiled
                            WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),// setting the working directory as the one where the file is stored
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        }
                    };

                    compileProcess.Start();//starting the compilation process
                    compileProcess.WaitForExit();// waiting for the compilation process to finish

                    if (compileProcess.ExitCode != 0)
                    {
                        // Compilation failed
                        var compileErrorMessage = compileProcess.StandardError.ReadToEnd();
                        return compileErrorMessage;
                    }

                    // Execute the compiled code
                    var executeProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = "java", // Use java directly without specifying the full path
                            Arguments = $"{Path.GetFileNameWithoutExtension(fileName)}",// running the executable file
                            WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),// keeping the working directory as the one where the executable file is saved
                            RedirectStandardOutput = true,
                            RedirectStandardInput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = false
                        }
                    };

                    executeProcess.Start();// running the executable file
                    using (var streamWriter = executeProcess.StandardInput)
                    {
                        // Write each input variable to a new line
                        foreach (var value in testcase)
                        {
                            streamWriter.WriteLine(value);
                        }
                    }
                    var output = executeProcess.StandardOutput.ReadToEnd();//storing output
                    executeProcess.WaitForExit();

                    // Return the output of the executed code
                    return output;
                }
                else if (language == "C#")
                {
                    var baseDirectory = @"C:\MyFiles"; 
                    var fileName = $"{Guid.NewGuid().ToString("N")}.cs";//getting a unique file name

                    // Get the path to the directory where the file will be saved
                    var filePath = Path.Combine(baseDirectory, fileName);

                    // Create the directory if it doesn't exist
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    // Write the code to the file
                    System.IO.File.WriteAllText(filePath, code);

                    // Compile the code using csc compiler
                    var compileProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = "csc", // Use csc directly without specifying the full path
                            Arguments = $"{fileName}",//passing the filename of the file to be compiled as argument 
                            WorkingDirectory = Path.Combine(baseDirectory), // the directory where the file to be compiled is stored
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        }
                    };

                    compileProcess.Start();//starting the compilation process
                    compileProcess.WaitForExit();// waiting for the compilation process to end

                    if (compileProcess.ExitCode != 0)
                    {
                        // Compilation failed
                        var compileErrorMessage = compileProcess.StandardError.ReadToEnd();
                        return compileErrorMessage;
                    }

                    // Execute the compiled code
                    var executeProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = $"{Path.Combine(baseDirectory, $"{Path.GetFileNameWithoutExtension(filePath)}")}", // Execute the compiled executable
                            WorkingDirectory = Path.Combine(baseDirectory),// the directory where the executable file is stored
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
                        // Write each input variable to a new line
                        foreach (var value in testcase)
                        {
                            streamWriter.WriteLine(value);
                        }
                    }

                    var output = executeProcess.StandardOutput.ReadToEnd();// storing the output
                    executeProcess.WaitForExit();
                    // Return the output of the executed code
                    return output;
                }
                else
                {
                    return $"Unsupported programming language: {language}";
                }
            }

            catch (Exception ex)
            {
                // Return an error response if something goes wrong
                return ex.Message;
            }
        }
    }
}
