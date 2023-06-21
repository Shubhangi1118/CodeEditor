import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

type TestCase = {
    inputs: Array<string>;
    expectedOutput: string;
};

type _Question = {
    _id: string;
    question: string;
    inputFormat: string;
    outputFormat: string;
    driverCode: Record<string, string>;
    testCases: Array<TestCase>;
};

function Editor() {
    const [editIndex, setEditIndex] = React.useState<number>(-1);
    const [_id, setId] = React.useState<string>("");
    const [question, setQuestion] = React.useState<string>("");
    const [inputFormat, setInputFormat] = React.useState<string>("");
    const [outputFormat, setOutputFormat] = React.useState<string>("");
    const [testCases, setTestCases] = React.useState<Array<TestCase>>([]);
    const [Questions, setQuestions] = React.useState<Array<_Question>>([]);
    const [numTestCases, setNumTestCases] = React.useState<number>(1);
    const [driverCode, setDriverCode] = React.useState<{ [key: string]: string }>({
        cpp: '#include<iostream>\n\nvoid solution() {\n  // Your code here\n}\n\nint main() {\n  solution();\n  return 0;\n}',
        csharp: 'using System;\n\nclass Program {\n  static void Solution() {\n    // Your code here\n  }\n\n  static void Main(string[] args) {\n    Solution();\n  }\n}',
        python: 'def solution():\n  # Your code here\n\nsolution()',
        java: 'public class Main {\n  public static void solution() {\n    // Your code here\n  }\n\n  public static void main(String[] args) {\n    solution();\n  }\n}'
    });



    React.useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        const result = await axios.get("https://localhost:44322/api/Editor");
        setQuestions(result.data);
        setEditIndex(-1);
    }
    function editQuestion(index: number) {
        const question = Questions[index];
        setId(question._id);
        setQuestion(question.question);
        setInputFormat(question.inputFormat);
        setOutputFormat(question.outputFormat);
        setTestCases(question.testCases);
        setEditIndex(index);
        setDriverCode({
            cpp: question.driverCode.cpp,
            csharp: question.driverCode.csharp,
            python: question.driverCode.python,
            java: question.driverCode.java
        });

    }
    async function save(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            const updatedDriverCode = {
                cpp: driverCode.cpp || '#include<iostream>\n\nvoid solution() {\n  // Your code here\n}\n\nint main() {\n  solution();\n  return 0;\n}',
                csharp: driverCode.csharp || 'using System;\n\nclass Program {\n  static void Solution() {\n    // Your code here\n  }\n\n  static void Main(string[] args) {\n    Solution();\n  }\n}',
                python: driverCode.python || 'def solution():\n  # Your code here\n\nsolution()',
                java: driverCode.java || 'public class Main {\n  public static void solution() {\n    // Your code here\n  }\n\n  public static void main(String[] args) {\n    solution();\n  }\n}'
            };
            if (editIndex === -1) {
                // Adding a new question
                await axios.post("https://localhost:44322/api/Editor", {
                    _id: "",
                    question: question,
                    inputFormat: inputFormat,
                    outputFormat:outputFormat,
                    testCases: testCases,
                    driverCode:updatedDriverCode
                });
                alert("Question Added Successfully");
            } else {
                // Updating an existing question
                await axios.put("https://localhost:44322/api/Editor/" + Questions[editIndex]._id, {
                    _id: _id,
                    question: question,
                    inputFormat: inputFormat,
                    outputFormat: outputFormat,
                    testCases: testCases,
                    driverCode:updatedDriverCode
                });
                alert("Question Updated Successfully");
            }

            setId("");
            setQuestion("");
            setInputFormat("");
            setOutputFormat("");
            setDriverCode({});
            setTestCases([]);
            setEditIndex(-1);
            await Load();
        } catch (err) {
            alert(err);
        }
    }

    async function DeleteQuestion(_id: string) {
        await axios.delete("https://localhost:44322/api/Editor/" + _id);
        alert("Question deleted Successfully");
        setId("");
        setQuestion("");
        setInputFormat("");
        setOutputFormat("");
        setDriverCode({});
        setTestCases([]);
        await Load();
    }
    function getTestCaseInputs(index: number): Array<string> {
        return testCases[index]?.inputs || [];
    }

    function setTestCaseInputs(index: number, values: Array<string>): void {
        const newTestCases = [...testCases];
        if (!newTestCases[index]) {
            newTestCases[index] = {
                inputs: values,
                expectedOutput: "", // Initialize with an empty string or appropriate default value
            };
        } else {
            newTestCases[index].inputs = values;
        }
        setTestCases(newTestCases);
    }

    function getTestCaseExpectedOutput(index: number): string {
        return testCases[index]?.expectedOutput || "";
    }

    function setTestCaseExpectedOutput(index: number, value: string): void {
        const newTestCases = [...testCases];
        if (!newTestCases[index]) {
            newTestCases[index] = {
                inputs: [],
                expectedOutput: value,
            };
        } else {
            newTestCases[index].expectedOutput = value;
        }
        setTestCases(newTestCases);
    }


    return (
        <div>
            <h1>Question Details</h1>
            <div className="container mt-4">
                <form>
                    <div className="form-group">

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

                        <label>Question</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Question"
                            value={question}
                            onChange={(event) => {
                                setQuestion(event.target.value);
                            }}
                        />
                        <label>Input Format</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Question"
                            value={inputFormat}
                            onChange={(event) => {
                                setInputFormat(event.target.value);
                            }}
                        />
                        <label>Output Format</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Question"
                            value={outputFormat}
                            onChange={(event) => {
                                setOutputFormat(event.target.value);
                            }}
                        />
                    </div>
                    <label>Template Code (C++)</label>
                    <textarea
                        className="form-control"
                        rows={10 }
                        value={driverCode.cpp}
                        onChange={(event) => {
                            setDriverCode({ ...driverCode, cpp: event.target.value });
                        }}
                    />

                    <label>Template Code (C#)</label>
                    <textarea
                        className="form-control"
                        rows={10 }
                        value={driverCode.csharp}
                        onChange={(event) => {
                            setDriverCode({ ...driverCode, csharp: event.target.value });
                        }}
                    />

                    <label>Template Code (Python)</label>
                    <textarea
                        className="form-control"
                        rows={10 }
                        value={driverCode.python}
                        onChange={(event) => {
                            setDriverCode({ ...driverCode, python: event.target.value });
                        }}
                    />

                    <label>Template Code (Java)</label>
                    <textarea
                        className="form-control"
                        rows={10 }
                        value={driverCode.java}
                        onChange={(event) => {
                            setDriverCode({ ...driverCode, java: event.target.value });
                        }}
                    />
                    <div>
                        {Array.from({ length: numTestCases }).map((_, i) => (
                            <div className="form-group" key={i}>
                                <label>TestCase {i + 1} Input</label>
                                <textarea
                                    className="form-control"
                                    id={`testCase${i + 1}`}
                                    value={getTestCaseInputs(i).join(",")}
                                    onChange={(event) => setTestCaseInputs(i, event.target.value.split(","))}
                                />
                                <div className="form-group" key={i+1}>
                                    <label>TestCase {i + 1} Expected Ouput</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id ={`expectedOutput${i + 1}`}
                                    value={getTestCaseExpectedOutput(i)}
                                    onChange={(event)=> setTestCaseExpectedOutput(i,event.target.value)}
                                />
                                </div>
                                </div>
                                    
                        ))}
                                

                    <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => setNumTestCases(numTestCases + 1)}
                    >
                        Add Test Case
                    </button>
                    </div>
                    <div>
                        <button>
                            <Link to="/Result">Check the results</Link>
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-primary mt-4" onClick={save}>
                            Add
                        </button>
                    </div>
                </form>
            </div>
            <br></br>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">Question No.</th>
                        <th scope="col">Question</th>
                        <th scope="col">Input Format</th>
                        <th scope="col">Output Format</th>
                        <th scope="col">TestCase Input</th>
                        <th scope ="col"> TestCase Expected Output</th>
                    </tr>
                </thead>
                {Questions.map(function fn(question: _Question, index: number) {
                    return (
                        <tbody>
                            <tr>
                                <th scope="row">{index+1} </th>
                                <td>{question.question}</td>
                                <td>{question.inputFormat}</td>
                                <td>{question.outputFormat}</td>
                                <td>
                                    {question.testCases.map(function fn(testCase, index) {
                                        return (<div key={index}>{testCase.inputs}</div>);
                                    })}
                                </td>
                                <td>
                                    {question.testCases.map(function fn(testCase, index) {
                                        return (<div key={index}>{testCase.expectedOutput}</div>);
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
                        </tbody>
                    );
                })}
            </table>

        </div>
    );
}
export default Editor;


