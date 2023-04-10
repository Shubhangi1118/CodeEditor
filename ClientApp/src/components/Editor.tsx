import axios from "axios";
import React from "react";
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
export { };
type _Question = {
    _id: string;
    question: string;
    languages: Array<string>;
    testCase1: string;
    testCase2: string;
    testCase3: string;
    expectedOutput1: string;
    expectedOutput2: string;
    expectedOutput3: string;


};

function Contest() {

    const [_id, setId] = React.useState<string>("");
    const [question, setQuestion] = React.useState<string>("");
    const [languages, setLanguages] = React.useState<Array<string>>([]);
    const [testCase1, setTestCase1] = React.useState<string>("");
    const [testCase2, setTestCase2] = React.useState<string>("");
    const [testCase3, setTestCase3] = React.useState<string>("");
    const [expectedOutput1, setExpectedOutput1] = React.useState<string>("");
    const [expectedOutput2, setExpectedOutput2] = React.useState<string>("");
    const [expectedOutput3, setExpectedOutput3] = React.useState<string>("");
    const [Questions, setQuestions] = React.useState<Array<_Question>>([]);

    React.useEffect(() => {
        (async () => await Load())();
    }, []);
    async function Load() {

        const result = await axios.get("https://localhost:44322/api/Editor");
        setQuestions(result.data);
        console.log(result.data);
    }
    async function save(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            await axios.post("https://localhost:44322/api/Editor", {
                _id: "",
                Question: question,
                Languages: languages,
                TestCase1: testCase1,
                TestCase2: testCase2,
                TestCase3: testCase3,
                ExpectedOutput1: expectedOutput1,
                ExpectedOutput2: expectedOutput2,
                ExpectedOutput3: expectedOutput3

            });
            alert("Question Added Successfully");
            setId("");
            setQuestion("");
            setLanguages([]);
            setTestCase1("");
            setTestCase2("");
            setTestCase3("");
            setExpectedOutput1("");
            setExpectedOutput2("");
            setExpectedOutput3("");


            Load();
        } catch (err) {
            alert(err);
        }
    }

    async function editQuestion(question: _Question) {
        setId(question._id);
        setQuestion(question.question);
        setLanguages(question.languages);
        setTestCase1(question.testCase1);
        setTestCase2(question.testCase2);
        setTestCase3(question.testCase3);
        setExpectedOutput1(question.expectedOutput1);
        setExpectedOutput2(question.expectedOutput2);
        setExpectedOutput3(question.expectedOutput3);

    }

    async function DeleteQuestion(_id: string) {
        await axios.delete("https://localhost:44322/api/Editor/" + _id);
        alert("Question deleted Successfully");
        setId("");
        setQuestion("");
        setLanguages([]);
        setTestCase1("");
        setTestCase2("");
        setTestCase3("");
        setExpectedOutput1("");
        setExpectedOutput2("");
        setExpectedOutput3("");
        Load();
    }

    async function update(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {

            await axios.put("https://localhost:44322/api/Editor/" + _id,


                {
                    _id: _id,
                    Question: question,
                    Languages: languages,
                    TestCase1: testCase1,
                    TestCase2: testCase2,
                    TestCase3: testCase3,
                    ExpectedOutput1: expectedOutput1,
                    ExpectedOutput2: expectedOutput2,
                    ExpectedOutput3: expectedOutput3

                }
            );
            alert("Question Updated");
            setId("");
            setQuestion("");
            setLanguages([]);
            setTestCase1("");
            setTestCase2("");
            setTestCase3("");
            setExpectedOutput1("");
            setExpectedOutput2("");
            setExpectedOutput3("");

            Load();
        } catch (err) {
            alert(err);
        }
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

                    <div className="form-group">
                        <label>Languages</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Languages"
                            value={languages}

                            onChange={(event) => {
                                setLanguages(event.target.value.split(','));
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>TestCase1</label>
                        <input
                            type="text"
                            className="form-control"
                            id="TestCases"
                            value={testCase1}


                            onChange={(event) => {

                                setTestCase1(event.target.value);
                            }}

                        />
                    </div>
                    <div className="form-group">
                        <label>TestCase2</label>
                        <input
                            type="text"
                            className="form-control"
                            id="TestCases"
                            value={testCase2}


                            onChange={(event) => {

                                setTestCase2(event.target.value);
                            }}

                        />
                    </div>
                    <div className="form-group">
                        <label>TestCase3</label>
                        <input
                            type="text"
                            className="form-control"
                            id="TestCases"
                            value={testCase3}


                            onChange={(event) => {

                                setTestCase3(event.target.value);
                            }}

                        />
                    </div>
                    <div className="form-group">
                        <label>ExppectedOutput1</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ExpectedOutput"
                            value={expectedOutput1}


                            onChange={(event) => {

                                setExpectedOutput1(event.target.value);
                            }}

                        />
                    </div>
                    <div className="form-group">
                        <label>ExpectedOutput2</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ExpectedOutput"
                            value={expectedOutput2}


                            onChange={(event) => {

                                setExpectedOutput2(event.target.value);
                            }}

                        />
                    </div>
                    <div className="form-group">
                        <label>ExpectedOutput3</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ExpectedOutput"
                            value={expectedOutput3}


                            onChange={(event) => {

                                setExpectedOutput3(event.target.value);
                            }}

                        />
                    </div>
                    <div>
                        <button className="btn btn-primary mt-4" onClick={save}>
                            Add
                        </button>
                        <button className="btn btn-warning mt-4" onClick={update}>
                            Update
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
                        <th scope="col">TestCase1</th>
                        <th scope="col">TestCase2</th>
                        <th scope="col">TestCase3</th>
                        <th scope="col">ExpectedOutput1</th>
                        <th scope="col">ExpectedOutput2</th>
                        <th scope="col">ExpectedOutput3</th>
                    </tr>
                </thead>
                {Questions.map(function fn(question: _Question) {
                    return (
                        <tbody>
                            <tr>
                                <th scope="row">{question._id} </th>
                                <td>{question.question}</td>
                                <td>{question.languages.join("    ")}</td>
                                <td>{question.testCase1}</td>
                                <td>{question.testCase2}</td>
                                <td>{question.testCase3}</td>
                                <td>{question.expectedOutput1}</td>
                                <td>{question.expectedOutput2}</td>
                                <td>{question.expectedOutput3}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() => editQuestion(question)}
                                    >
                                        Edit
                                    </button>
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
export default Contest;


