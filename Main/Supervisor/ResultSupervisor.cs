using Contest;
using Main.Models;
using System.Diagnostics;

namespace Main.Supervisor
{
    public class ResultSupervisor
    {
        // Dependency injection of IResult
        private IResult _result;
        public ResultSupervisor(IResult result)
        {
            _result = result;
        }
        // Getting the results array
        public async Task<List<ResultData>> GetResultAsync() =>
           await _result.GetResultAsync();
        // getting a result with the given id
        public async Task<ResultData> GetResultAsync(string id)
        {
            var result = await _result.GetResultAsync(id);
            return result;
        }
        public async Task<string> CreateResultAsync(CodeInput codeInput)
        {
            try
            {
                // getting code, language, question number, participant Id,inputs and expected outputs from the frontend
                string code = codeInput.code;
                string language = codeInput.language;
                int QuestionNumber = codeInput.QuestionNumber;
                string participantId = codeInput.participantId;
                List<List<string>> inputs = codeInput.testCaseInputs;
                List<string> expectedoutputs = codeInput.expectedOutputs;
                List<int> outputs = new List<int>();// creating a list for all the testcases if the output is correct or not
                int i = 0;
                
                if (language == "C++")
                {
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
                            Arguments = $"{fileName} -o {Path.GetFileNameWithoutExtension(filePath)}",//passing the file to be compiled and name of the executable file to be created
                            WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),// the directory where the file to be compiled is stored
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        }
                    };

                    compileProcess.Start();// starting the compilation process
                    compileProcess.WaitForExit();// waiting for the compilation process to end

                    if (compileProcess.ExitCode != 0)
                    {
                        // Compilation failed
                        foreach(var input in inputs)
                        {
                            outputs.Add(0);//all testcase failed if the compilation failed
                        }
                    }
                    foreach (var input in inputs)// running the executable file for all the test case inputs 
                    {
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

                        executeProcess.Start();// starting t
                        // Write input to the standard input of the executed code
                        using (var streamWriter = executeProcess.StandardInput)
                        {
                            // Write each input variable to a new line
                            foreach (var value in input)
                            {
                                streamWriter.WriteLine(value) ;
                            }    
                        }
                        var output = executeProcess.StandardOutput.ReadToEnd();// storing the output
                        executeProcess.WaitForExit();// waiting for the execution of the file to be finished
                        if (output == expectedoutputs[i])// if output is same as the expectedoutput test case passed
                        {
                            outputs.Add(1);
                        }
                        else
                        {
                            outputs.Add(0);// Otherwise test case failed
                        }
                        i++;
                    }
 
                    ResultData newparticipant = new ResultData();//making an instance of ResultData
                    // Assigning the result values in the new instance 
                    newparticipant.Outputs = outputs;
                    newparticipant.participantId = participantId;
                    newparticipant.questionNumber = QuestionNumber;
                    await _result.CreateResultAsync(newparticipant);//storing the instance of ResultData in the database
                    return "Success";
                }
                else if (language == "Python")
                {
                    // Generate a unique file name
                    var fileName = $"{Guid.NewGuid().ToString("N")}.py";

                    // Get the path to the directory where the file will be saved
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles", fileName);

                    // Create the directory if it doesn't exist
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    // Write the code to the file
                    System.IO.File.WriteAllText(filePath, code);

                    // Execute the code using python
                    foreach (var input in inputs)// running the file for each test case
                    {
                        var executeProcess = new Process
                        {
                            StartInfo = new ProcessStartInfo
                            {
                                FileName = "python", // Use python directly without specifying the full path
                                Arguments = fileName,// passing the file name to be interpreted or executed
                                WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),// the directory where the file is stored
                                RedirectStandardOutput = true,
                                RedirectStandardInput = true,
                                RedirectStandardError = true,
                                UseShellExecute = false,
                                CreateNoWindow = false
                            }
                        };

                        executeProcess.Start();// start executing teh file

                        // Write input to the standard input of the executed code
                        using (var streamWriter = executeProcess.StandardInput)
                        {
                            // Write each input variable to a new line
                            foreach (var value in input)
                            {
                                streamWriter.WriteLine(value);
                            }
                        }

                        var output = executeProcess.StandardOutput.ReadToEnd();// storing the ouputs
                        executeProcess.WaitForExit();

                        if (output == expectedoutputs[i])// if ouput is same as the expected ouput test case is passed
                        {
                            outputs.Add(1);
                        }
                        else
                        {
                            outputs.Add(0);// if output is not same as the expected ouput test case is failed
                        }
                        i++;
                    }
                    ResultData newparticipant = new ResultData();//making an instance of ResultData
                    // Assigning the result values in the new instance 
                    newparticipant.Outputs = outputs;
                    newparticipant.participantId = participantId;
                    newparticipant.questionNumber = QuestionNumber;
                    await _result.CreateResultAsync(newparticipant);//storing the instance of ResultData in the database
                    return "Success";

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
                    var fileName = $"{className}.java";//giving the file the name of the class with proper extension

                    // Save the Java code to the file using the new filename
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles", fileName);
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));//create the directory if the directory doesn't already exist
                    System.IO.File.WriteAllText(filePath, code);

                    // Compile the code using javac compiler
                    var compileProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = "javac", // Use javac directly without specifying the full path
                            Arguments = fileName,// passing the file name of the file to be compiled
                            WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),// directory where the file is stored
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        }
                    };

                    compileProcess.Start();// starting compiling of the file
                    compileProcess.WaitForExit();// waiting for teh compilation to end

                    if (compileProcess.ExitCode != 0)
                    {
                        // Compilation failed
                        foreach(var input in inputs)
                        {
                            outputs.Add(0);// all test case failed if compilation failed
                        }
                    }

                    // Execute the compiled code
                    foreach (var input in inputs)// executing teh file for all the test cases
                    {
                        var executeProcess = new Process
                        {
                            StartInfo = new ProcessStartInfo
                            {
                                FileName = "java", // Use java directly without specifying the full path
                                Arguments = $"{Path.GetFileNameWithoutExtension(fileName)}",// running the executable file
                                WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "CodeFiles"),// directory where the file is stored
                                RedirectStandardOutput = true,
                                RedirectStandardInput = true,
                                RedirectStandardError = true,
                                UseShellExecute = false,
                                CreateNoWindow = false
                            }
                        };

                        executeProcess.Start();// starting executing the file

                        // Write input to the standard input of the executed code
                        using (var streamWriter = executeProcess.StandardInput)
                        {
                            // Write each input variable to a new line
                            foreach (var value in input)
                            {
                                streamWriter.WriteLine(value);
                            }
                        }

                        var output = executeProcess.StandardOutput.ReadToEnd();// storing the ouput
                        executeProcess.WaitForExit();// waiting for the execution of the file to be finished
                        if (output == expectedoutputs[i])// if ouput is same as the expected ouput test case is passed
                        {
                            outputs.Add(1);
                        }
                        else
                        {
                            outputs.Add(0);// if output is not same as the expected ouput test case is failed
                        }
                        i++;
                    }
                    ResultData newparticipant = new ResultData();//making an instance of ResultData
                    // Assigning the result values in the new instance 
                    newparticipant.Outputs = outputs;
                    newparticipant.participantId = participantId;
                    newparticipant.questionNumber = QuestionNumber;
                    await _result.CreateResultAsync(newparticipant);//storing the instance of ResultData in the database
                    return "Sucess";                }
                else if (language == "C#")
                {
                    var baseDirectory = @"C:\MyFiles"; 
                    var fileName = $"{Guid.NewGuid().ToString("N")}.cs";// getting a unique file name

                    // Get the path to the directory where the file will be saved
                    var filePath = Path.Combine(baseDirectory, fileName);

                    // Create the directory if it doesn't exist
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    // Write the code to the file
                    System.IO.File.WriteAllText(filePath, code);

                    // Compile the code using javac compiler
                    var compileProcess = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = "csc", // Use csc directly without specifying the full path
                            Arguments = $"{fileName}",// passing the file to be compiled
                            WorkingDirectory = Path.Combine(baseDirectory), // Directory where the file is stored
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        }
                    };
                    compileProcess.Start();// starting the compilation process
                    compileProcess.WaitForExit();// waiting for the compilation to end

                    if (compileProcess.ExitCode != 0)
                    {
                        // Compilation failed
                        foreach (var input in inputs)// if compilation is failed all test cases have failed
                        {
                            outputs.Add(0);
                        }
                    }

                    // Execute the compiled code
                    foreach (var input in inputs)// executing the file for each test case
                    {
                        var executeProcess = new Process
                        {
                            StartInfo = new ProcessStartInfo
                            {
                                FileName = $"{Path.Combine(baseDirectory, $"{Path.GetFileNameWithoutExtension(filePath)}")}", // Execute the compiled executable
                                WorkingDirectory = Path.Combine(baseDirectory),// the directory where the file is stored
                                RedirectStandardOutput = true,
                                RedirectStandardInput = true,
                                RedirectStandardError = true,
                                UseShellExecute = false,
                                CreateNoWindow = false
                            }
                        };

                        executeProcess.Start();// starting executing the process

                        // Write input to the standard input of the executed code
                        using (var streamWriter = executeProcess.StandardInput)
                        {
                            // Write each input variable to a new line
                            foreach (var value in input)
                            {
                                streamWriter.WriteLine(value);
                            }
                        }

                        var output = executeProcess.StandardOutput.ReadToEnd();// storing the value of the ouput
                        executeProcess.WaitForExit();// waiting for the execution of teh file to be finished
                        if (output == expectedoutputs[i])// if ouput is same as the expected ouput test case is passed
                        {
                            outputs.Add(1);
                        }
                        else
                        {
                            outputs.Add(0);// if output is not same as the expected ouput test case is failed
                        }
                        i++;
                    }
                    ResultData newparticipant = new ResultData();//making an instance of ResultData
                    // Assigning the result values in the new instance
                    newparticipant.Outputs = outputs;
                    newparticipant.participantId = participantId;
                    newparticipant.questionNumber = QuestionNumber;
                    await _result.CreateResultAsync(newparticipant);//storing the instance of ResultData in the database
                    return "Sucess";
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
