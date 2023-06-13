import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

type _Question = {
    _id: string;
    question: string;
    testCases: Array<string>;
    expectedOutputs: Array<string>;
};

function Editor() {

    const [_id, setId] = React.useState<string>("");
    const [question, setQuestion] = React.useState<string>("");
    const [testCases, setTestCases] = React.useState<Array<string>>([]);
    const [expectedOutputs, setExpectedOutputs] = React.useState<Array<string>>([]);
    const [Questions, setQuestions] = React.useState<Array<_Question>>([]);
    const [numTestCases, setNumTestCases] = React.useState<number>(1);

    React.useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        const result = await axios.get("https://localhost:44322/api/Editor");
        setQuestions(result.data);
    }

    async function save(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            await axios.post("https://localhost:44322/api/Editor", {
                _id: "",
                question: question,
                testCases: testCases,
                expectedOutputs: expectedOutputs
            });
            alert("Question Added Successfully");
            setId("");
            setQuestion("");
            setTestCases([]);
            setExpectedOutputs([]);
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
        setTestCases([]);
        setExpectedOutputs([]);
        await Load();
    }

    function getTestCase(index: number): string {
        return testCases[index] || "";
    }

    function setTestCase(index: number, value: string): void {
        const newTestCases = [...testCases];
        newTestCases[index] = value;
        setTestCases(newTestCases);
    }
    function getExpectedOutput(index: number): string {
        return expectedOutputs[index] || "";
    }

    function setExpectedOutput(index: number, value: string): void {
        const newExpectedOutputs = [...expectedOutputs];
        newExpectedOutputs[index] = value;
        setExpectedOutputs(newExpectedOutputs);
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
                    </div>
                    <div>
                        {Array.from({ length: numTestCases }).map((_, i) => (
                            <div>
                            <div className="form-group" key={i}>
                                <label>TestCase {i + 1}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={`testCase${i + 1}`}
                                    value={getTestCase(i)}
                                    onChange={(event) => setTestCase(i, event.target.value)}
                                />
                            </div>
                                <div className="form-group" key={i+1}>
                                    <label>ExpectedOutput {i + 1}</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id ={`expectedOutput${i + 1}`}
                                    value={getExpectedOutput(i)}
                                    onChange={(event)=> setExpectedOutput(i,event.target.value)}
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
                        <th scope="col">Question Id</th>
                        <th scope="col">Question</th>
                        <th scope="col">Languages</th>
                        <th scope="col">TestCases</th>
                        <th scope ="col">ExpectedOutputs</th>
                    </tr>
                </thead>
                {Questions.map(function fn(question: _Question) {
                    return (
                        <tbody>
                            <tr>
                                <th scope="row">{question._id} </th>
                                <td>{question.question}</td>
                                <td>
                                    {question.testCases.map(function fn(testCase, index) {
                                        return (<div key={index}>{testCase}</div>);

                                    })}
                                </td>
                                <td>
                                    {question.expectedOutputs.map(function fn(expectedOutput, index) {
                                        return (<div key={index}>{expectedOutput}</div>);

                                    })}
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


