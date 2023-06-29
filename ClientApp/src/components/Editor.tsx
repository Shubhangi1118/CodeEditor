//importing the libraries
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

type TestCase = {
    inputs: string;// the input of the testCase
    expectedOutput: string;// expectedOuput of the testCase
};
const darkTheme = {
    backgroundColor: "#2b2b2b",
    color: "#d4d4d4",
};

type _Question = {
    _id: string;// Question id in the database
    question: string; // Question Description
    explanationExample: string;// explanation of atleast one example
    inputFormat: string; //description of inputs of the code
    outputFormat: string;// description of outputs of the code
    driverCode1: { // it contains the imported libraries for the code
        [key: string]: string;
    };
    functionCode: { // it contains the user defined function which will be displayed while the contest to the participant to write the code in
        [key: string]: string;
    };
    driverCode2: {// It contains the amin function of the code or where the code is called and inpust and outputs are taken care of
        [key: string]: string;
    };
    testCases: Array<TestCase>;// array of the testcase
};
function Editor() {
    //the variables are defined and initialised
    const [editIndex, setEditIndex] = React.useState<number>(-1);// Question index
    const [_id, setId] = React.useState<string>("");//Question Databse id
    const [question, setQuestion] = React.useState<string>(""); // Question Description
    const [explanationExample, setExplanationExample] = React.useState<string>("");// variable for explaining examples
    const [inputFormat, setInputFormat] = React.useState<string>(""); // taking the types of input in the question
    const [outputFormat, setOutputFormat] = React.useState<string>("");// taking the type of output in the code
    const [testCases, setTestCases] = React.useState<Array<TestCase>>([]);// Array of testcases for the question
    const [Questions, setQuestions] = React.useState<Array<_Question>>([]);// array of Questions for the contest
    const [numTestCases, setNumTestCases] = React.useState<number>(1);// This variable stores the number of testcases for each question
    // The driver code here consists of driverCode1, Function Code and driverCode2 for all the langugaes and it is given the initial value too for all the languages
    const [driverCode, setDriverCode] = React.useState<{
        [key: string]: {
            driverCode1: string;
            functionCode: string;
            driverCode2: string;
        };
    }>({
        cpp: {
            driverCode1:
                '#include<iostream>\nusing namespace std;\n\n}',
            functionCode: 'void solution() {\n  // Your code here\n}',
            driverCode2: '\n\nint main() {\n  /*All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later*/ solution();\n  return 0;\n}',
        },
        csharp: {
            driverCode1: 'using System;\n\n}',
            functionCode: 'static void Solution() {\n  // Your code here\n}',
            driverCode2: '\n\n  static void Main(string[] args) {\n /*All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later*/    Solution();\n  }\n}',
        },
        python: {
            driverCode1: '',
            functionCode: 'def solution():\n  # Your code here',
            driverCode2: '\n\n """All the array outputs should be printed by adding one space after each element and if the ouput is not an array it needs to be printed without adding a new line later""" solution()',
        },
        java: {
            driverCode1: 'public class Main \n\n}',
            functionCode: 'public static void solution() {\n  // Your code here\n}',
            driverCode2: '\n\n  public static void main(String[] args) {\n  /*All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later*/   solution();\n  }\n',
        },
    });
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>("cpp");//The language option is given to set the Driver Code for each language and this variable indicates which language has been selected
    React.useEffect(() => {
        (async () => await Load())();
    }, []);
    // getting all the questions data
    async function Load() {
        const result = await axios.get("https://localhost:44322/api/Editor");
        setQuestions(result.data);
        setEditIndex(-1);
    }
    // function for filling the values of the question the question to be edited in the form
    function editQuestion(index: number) {
        const question = Questions[index];
        setId(question._id);
        setQuestion(question.question);
        setExplanationExample(question.explanationExample);
        setInputFormat(question.inputFormat);
        setOutputFormat(question.outputFormat);
        setTestCases(question.testCases);
        setEditIndex(index);
        setDriverCode({
            cpp: {
                driverCode1: question.driverCode1.cpp,
                functionCode: question.functionCode.cpp,
                driverCode2: question.driverCode2.cpp,
            },
            csharp: {
                driverCode1: question.driverCode1.csharp,
                functionCode: question.functionCode.csharp,
                driverCode2: question.driverCode2.csharp,
            },
            python: {
                driverCode1: question.driverCode1.python,
                functionCode: question.functionCode.python,
                driverCode2: question.driverCode2.python,
            },
            java: {
                driverCode1: question.driverCode1.java,
                functionCode: question.functionCode.java,
                driverCode2: question.driverCode2.java,
            },
        });
    }
    async function save() {
        // creating an instance of Question and assigning value to it
        try {
            const newQuestion: _Question = {
                _id,
                question,
                explanationExample,
                inputFormat,
                outputFormat,
                driverCode1: {
                    cpp: driverCode.cpp.driverCode1,
                    csharp: driverCode.csharp.driverCode1,
                    python: driverCode.python.driverCode1,
                    java: driverCode.java.driverCode1,
                },
                functionCode: {
                    cpp: driverCode.cpp.functionCode,
                    csharp: driverCode.csharp.functionCode,
                    python: driverCode.python.functionCode,
                    java: driverCode.java.functionCode,
                },
                driverCode2: {
                    cpp: driverCode.cpp.driverCode2,
                    csharp: driverCode.csharp.driverCode2,
                    python: driverCode.python.driverCode2,
                    java: driverCode.java.driverCode2,
                },
                testCases,
            };
            // editIndex>=0 means the question was already presant and was supposed to be edited
            if (editIndex >= 0) {
                const updatedQuestions = [...Questions];//creating a copy of Questions array
                updatedQuestions[editIndex] = newQuestion;//changing the Questions at the index
                await axios.put(
                    `https://localhost:44322/api/Editor/${newQuestion._id}`,//changing the question in the database
                    newQuestion
                );
                setQuestions(updatedQuestions);// setting the Questions array to the new copy after changes
                alert("Question Updated Successfully");
            }//if the editIndex==-1 it means there is a new question to be added
            else {
                await axios.post("https://localhost:44322/api/Editor", newQuestion);// adding new question to the database
                alert("Question Added Successfully");
                await Load();// waiting for the questions array to be assigned updated value
            }
            // setting the values in the form to be initial values
            setId("");
            setQuestion("");
            setExplanationExample("");
            setInputFormat("");
            setOutputFormat("");
            setTestCases([]);
            setSelectedLanguage("cpp");
            setDriverCode({
                cpp: {
                    driverCode1:
                        '#include<iostream>\nusing namespace std;\n\n}',
                    functionCode: 'void solution() {\n  // Your code here\n}',
                    driverCode2: '\n\nint main() {\n  /*All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later*/ solution();\n  return 0;\n}',
                },
                csharp: {
                    driverCode1:
                        'using System;\n\n}',
                    functionCode: 'static void Solution() {\n  // Your code here\n}',
                    driverCode2: '\n\n  static void Main(string[] args) {\n  /*All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later*/   Solution();\n  }\n}',
                },
                python: {
                    driverCode1: '',
                    functionCode: 'def solution():\n  # Your code here',
                    driverCode2: '\n\n """All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later""" solution()',
                },
                java: {
                    driverCode1:
                        'public class Main\n\n }',
                    functionCode: 'public static void solution() {\n  // Your code here\n}',
                    driverCode2: '\n\n  public static void main(String[] args) {\n /*All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later*/    solution();\n  }\n',
                },
            });
        }
        catch (err) {
            alert(err);
        }
    }
    async function DeleteQuestion(_id: string) {
        try {
            await axios.delete("https://localhost:44322/api/Editor/" + _id);// deleting the question with the id as _id
            alert("Question deleted Successfully");
            await Load();// laoding the updated value of Questions array
            // setting the values to be initial values
            setId("");
            setQuestion("");
            setExplanationExample("");
            setInputFormat("");
            setOutputFormat("");
            setDriverCode({
                cpp: {
                    driverCode1:
                        '#include<iostream>\nusing namespace std;\n\n',
                    functionCode: 'void solution() {\n  // Your code here\n}',
                    driverCode2: '\n\nint main() {\n /*All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later*/  solution();\n  return 0;\n}',
                },
                csharp: {
                    driverCode1:
                        'using System;\n\n',
                    functionCode: 'static void Solution() {\n  // Your code here\n}',
                    driverCode2: '\n\n  static void Main(string[] args) {\n  /*All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later*/   Solution();\n  }\n}',
                },
                python: {
                    driverCode1: '',
                    functionCode: 'def solution():\n  # Your code here',
                    driverCode2: '\n\n """All the array outputs should be printed by adding one space after each element  and if the ouput is not an array it needs to be printed without adding a new line later""" solution()',
                },
                java: {
                    driverCode1:
                        'public class Main\n\n',
                    functionCode: 'public static void solution() {\n  // Your code here\n}',
                    driverCode2: '\n\n  public static void main(String[] args) {\n /*All the array outputs should be printed by adding one space after each element and if the ouput is not an array it needs to be printed without adding a new line later*/   solution();\n  }\n',
                },
            });
            setTestCases([]);
        }
        catch (err) {
            alert(err);
        }
    }
    
    function getTestCaseExpectedOutput(index: number): string {
        return testCases[index]?.expectedOutput || "";//if testcase at the index is present it returns the expectedoutput otherwise return an empty string
    }

    function setTestCaseExpectedOutput(index: number, value: string): void {
        const newTestCases = [...testCases];// creating a copy of testCases  array
        if (!newTestCases[index]) {// if the testcase is not present at that index it assigns expectedoutput the value passed and inputs an empty string 
            newTestCases[index] = {
                inputs: "",
                expectedOutput: value,
            };
        } else {// otherwise it assigns expectedoutput the value passed
            newTestCases[index].expectedOutput = value;
        }
        setTestCases(newTestCases);
    }
    function getTestCaseInputs(index: number): string {//if testcase at the index is present it returns the inputs otherwise return an empty string
        const inputs = testCases[index]?.inputs || "";
        return inputs;
    }
    function setTestCaseInputs(index: number, value:string): void {
        const newTestCases = [...testCases];
        if (!newTestCases[index]) {// if the testCase is not present at that index it assigns inputs the value passed and expectedoutputs an empty string
            newTestCases[index] = {
                inputs: value,
                expectedOutput: "", // Initialize with an empty string or appropriate default value
            };
        } else {// otherwise it assigns inputs the value passed
            newTestCases[index].inputs = value;
        }
        setTestCases(newTestCases);
    }

    return (
        <div>
            <h1>Question Details</h1>
            <div className="container mt-4">
                <form>
                    <div className="form-group">
                        {/*_id of the question is hidden in the form*/}
                        <input
                            type="text"
                            className="form-control"
                            id="_id"
                            hidden
                            value={_id}
                            onChange={(event) => {
                                setId(event.target.value);
                            }}
                        />
                        {/*Question Description field of the form takes input and sets the question description*/}
                        <label>Question Description</label>
                        <textarea
                            className="form-control"
                            placeholder = "Describe the Question here"
                            id="Question"
                            value={question}
                            onChange={(event) => {
                                setQuestion(event.target.value);
                            }}
                        />
                        {/*Example explanation field of the form takes input and sets the question description*/}
                        <label>Example Explanation</label>
                        <textarea
                            className="form-control"
                            placeholder = "Explain atleast one example with input and ouput"
                            id="ExampleExplanation"
                            value={explanationExample}
                            onChange={(event) => {
                                setExplanationExample(event.target.value);
                            }}
                        />
                        {/*Description of the input parameters is taken through the form*/ }
                        <label>Input Parameters</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter the input parameters description here"
                            id="Question"
                            value={inputFormat}
                            onChange={(event) => {
                                setInputFormat(event.target.value);
                            }}
                        />
                        {/*Description of the output parameters is taken through the form*/ }
                        <label>Output Parameter</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter the output description here. There will be only one output "
                            id="Question"
                            value={outputFormat}
                            onChange={(event) => {
                                setOutputFormat(event.target.value);
                            }}
                        />
                    </div>
                    {/*Option to select the language to edit the driver code*/ }
                    <label>Select Language:</label>
                    <select
                        className="form-control"
                        value={selectedLanguage}
                        onChange={(event) => setSelectedLanguage(event.target.value)}
                    >
                        <option value="cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                    {/*Taking the code of importing libraries through form*/ }
                    <label>Driver Code1(For importing the libraries in the code)</label>
                    <textarea
                        className="form-control"
                        rows={10}
                        style={darkTheme}
                        value={driverCode[selectedLanguage].driverCode1}
                        onChange={(event) =>
                            setDriverCode({
                                ...driverCode,
                                [selectedLanguage]: {
                                    ...driverCode[selectedLanguage],
                                    driverCode1: event.target.value,
                                },
                            })
                        }
                    />
                    {/* Taking the user defined function in which the participant will write all the code*/ }
                    <label>Function Code (The user defined function, where the participant will edit the code)</label>
                    <textarea
                        className="form-control"
                        rows={10}
                        style={darkTheme}
                        value={driverCode[selectedLanguage].functionCode}
                        onChange={(event) =>
                            setDriverCode({
                                ...driverCode,
                                [selectedLanguage]: {
                                    ...driverCode[selectedLanguage],
                                    functionCode: event.target.value,
                                },
                            })
                        }
                    />
                    {/*Taking the main function code or the code where we will call the function and where all the inputs and outputs will be taken care of*/ }
                    <label>Driver Code2 (Main function or the code where calling of the user defined function and taking inputs and printing outputs are taken care of)</label>
                    <textarea
                        className="form-control"
                        rows={10}
                        style={darkTheme}
                        value={driverCode[selectedLanguage].driverCode2}
                        onChange={(event) =>
                            setDriverCode({
                                ...driverCode,
                                [selectedLanguage]: {
                                    ...driverCode[selectedLanguage],
                                    driverCode2: event.target.value,
                                },
                            })
                        }
                    />
                    <div>
                        {/*using map to get an array of TestCases*/}
                        {Array.from({ length: numTestCases }).map((_, i) => (
                            <div className="form-group" key={i}>
                                <label>TestCase {i + 1} Input</label>
                                <textarea
                                    className="form-control"
                                    id={`testCase${i + 1}`}
                                    placeholder='Write the inputs in this format.nums = [2, 7, 11, 15], target = 9, Countries = ["India","Japan"], name = "Shubhangi". Please remember to use a space before = sign and after = sign'
                                    value={getTestCaseInputs(i)}
                                    onChange={(event) => setTestCaseInputs(i, event.target.value)}
                                />
                                <div className="form-group" key={i + 1}>
                                    <label>TestCase {i + 1} Expected Ouput</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder= 'Write the ouput like this if it is an array nums = [2, 7, 11, 15], if it is a number target = 9, if it is a string name = "Shubhnagi", if it is an array of strings Countries = ["India","Japan"].Please remember to use a space before = sign and after = sign '
                                        id={`expectedOutput${i + 1}`}
                                        value={getTestCaseExpectedOutput(i)}
                                        onChange={(event) => setTestCaseExpectedOutput(i, event.target.value)}
                                    />
                                </div>
                            </div>

                        ))}

                        {/*button to increase the number of testcases by 1*/ }
                        <button
                            type="button"
                            className="btn btn-primary mt-2"
                            onClick={() => setNumTestCases(numTestCases + 1)}
                        >
                            Add Test Case
                        </button>
                    </div>
                    <div>
                        {/*button to edit or add Question*/ }
                        <button type="button" className="btn btn-primary mt-4" onClick={save}>
                            Submit
                        </button>
                    </div>
                    <div>
                        {/* To check the result of the contests for the participant*/ }
                        <button>
                            <Link to="/Result">Check the results</Link>
                        </button>
                    </div>
                </form>
            </div>
            <br></br>
            {/*Table to display all the questions*/ }
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">Question No.</th>
                        <th scope="col">Question</th>
                        <th scope="col">Input Format</th>
                        <th scope="col">Output Format</th>
                        <th scope="col">Test Cases</th>
                        <th></th> {/* Empty column for buttons */}
                    </tr>
                </thead>
                <tbody>
                    {Questions.map(function fn(question: _Question, index: number) {
                        return (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{question.question}</td>
                                <td>{question.inputFormat}</td>
                                <td>{question.outputFormat}</td>
                                <td>
                                    {question.testCases.map(function fn(testCase, caseIndex) {
                                        return (
                                            <div key={caseIndex}>
                                                <strong>Test Case {caseIndex + 1}:</strong>
                                                <div>
                                                    <strong>Input:</strong> {testCase.inputs}
                                                </div>
                                                <div>
                                                    <strong>Expected Output:</strong> {testCase.expectedOutput}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => editQuestion(index)}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => DeleteQuestion(question._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
export default Editor;


