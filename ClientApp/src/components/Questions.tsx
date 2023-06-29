// importing the libraries
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
//AceEditor is used for the syntax highlighting and theme of teh editor
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';


// EditorProps object defined to pass the values to the editor
interface EditorProps {
    code: string;
    onChange: (value: string) => void;
    onLanguageChange: (language: string) => void;
    selectedLanguage: string;
    languageOptions: string[];
    driverCode: { [key: string]: string };
}
const Editor: React.FC<EditorProps> = ({
    code,
    onChange,
    onLanguageChange,
    selectedLanguage,
    languageOptions,
    driverCode
}) => {
    //defining a variable as null referring to an instance of AceEditor
    const editorRef = useRef<AceEditor | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            // Set the driver code as the initial value of the editor
            if (selectedLanguage === 'C++') {
                editorRef.current.editor.setValue(driverCode['cpp']);
            }
            else if (selectedLanguage === 'Java') {
                editorRef.current.editor.setValue(driverCode['java']);
            }
            else if (selectedLanguage === 'Python') {
                editorRef.current.editor.setValue(driverCode['python']);
            }
            else {
                editorRef.current.editor.setValue(driverCode['csharp']);
            }
        }
    }, [selectedLanguage, driverCode]);
    // forwards the value to the onchange function
    const handleChange = (value: string) => {
        onChange(value);
    };
    // change sthe value of selectedLanguage based on the language selected by the user through the drop down list
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const language = event.target.value;
        onLanguageChange(language);
    };
    // assigning AceEditor mode according to the selected Language
    let mode = '';
    if (selectedLanguage === 'C++') {
        mode = 'c_cpp';
    } else if (selectedLanguage === 'Java') {
        mode = 'java';
    } else if (selectedLanguage === 'Python') {
        mode = 'python';
    }
    else {
        mode = 'csharp';
    }

    return (
        <div>
            {/*dropdown to select the language*/ }
            <select value={selectedLanguage} onChange={handleLanguageChange}>
                {languageOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <div className="editor-wrapper">
                <AceEditor
                    mode={mode}
                    theme="dracula"
                    value={code}
                    onChange={handleChange}//sets the code by using handleChange function
                    editorProps={{ $blockScrolling: true }}
                    width="100%"
                    height="400px"
                    ref={(ref) => {
                        editorRef.current = ref;
                    }}
                    //setting the options for enabling autocompletion and snippets
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                    }}
                />
            </div>
        </div>
    );
};
// used to pass the result of the code to Ouput
interface OutputProps {
    result: string;
}
//displays the result of the code
const Output: React.FC<OutputProps> = ({ result }) => {
    return (
        <div className="output">
            <pre>{result}</pre>
        </div>
    );
};
type TestCase = {
    inputs: string;// the input of the testCase
    expectedOutput: string;// expectedOuput of the testCase
};

type _Question = {
    _id: string;// Question id in the database
    question: string; // Question Description
    explanationExample:string;//Explanation to atleast explain with one example
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
//used for getting the particiant through route parameters
interface RouteParams {
    participantId: string;
}

const Questions: React.FC = () => {
    const { participantId } = useParams<RouteParams>();//getting the participant id from the route parameters
    const [code, setCode] = useState<string>('');// variable for storing the value of code
    const [result, setResult] = useState<string>('');//variable for storing the value of output of executing the code
    const [currentQuestion, setCurrentQuestion] = useState(0);//variable for storing the question index
    const [_Questions, setQuestions] = useState<Array<_Question>>([]);//variable for storing the array of Question
    const [selectedLanguage, setSelectedLanguage] = useState<string>('C++');//variable for storing the language user selected
    const [customTestCaseEntered, setCustomTestCaseEntered] = useState(false);//variable for checking if the customInput has been enetered by the user or not
    const languageOptions = ['C++', 'Java', 'Python', 'C#'];// Variable storing the array of languages available
    

    const extractStrings = (input: string = "") => {
        const processedInputs: string[] = [];

        // Split the input string while ignoring commas inside quotes and brackets
        const inputs = input.match(/"[^"]*"|'[^']*'|\[[^\]]*\]|[^,\s]+/g) || [];

        // Process each input and add to the processedInputs array based on the conditions
        for (let i = 2; i < inputs.length; i += 3) {
            let value = inputs[i];

            // Remove leading/trailing whitespaces
            value = value.trim();

            // Remove brackets and commas around arrays
            value = value.replace(/^\[|\]$/g, "");
            value = value.replace(/,/g, " ");

            // Remove quotes around strings and string variables
            value = value.replace(/^"(.*)"$/, "$1");
            value = value.replace(/^'(.*)'$/, "$1");
            value = value.replace(/"\s*([^"]*?)\s*"/g, "$1 ");
            value = value.replace(/'\s*([^']*?)\s*'/g, "$1 ");

            // Split the value into individual strings if it represents an array
            const strings = value.split(" ").filter(Boolean); // Filter out empty strings

            // Add the joined string to the array of processed inputs
            value = strings.join(" ");
            if (strings.length > 1) {
                value += " ";
            }
            processedInputs.push(value);
        }

        return processedInputs;
    };

    const [customTestCase, setCustomTestCase] = useState(extractStrings(_Questions[currentQuestion]?.testCases[0].inputs) || []);//variable for storing the customInput 
    // updating the customtestcase as the current question gets changed
    useEffect(() => {
        axios
            .get('https://localhost:44322/api/Editor')
            .then((response) => {
                setQuestions(response.data);
                // Set the custom test case to the first test case inputs of the current question
                setCustomTestCase(extractStrings(response.data[currentQuestion]?.testCases[0]?.inputs) || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [currentQuestion]);
    //changing the code as user edits it
    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };
    //chnges the language as the user selects the langauge
    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
    };
   // whenever a user clicks on the next button it changes the question index and sets the custom input
    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < _Questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setCurrentQuestion(0);
        }   
    };
    const handleSendFirstTestcase = () => {
        // Make API call to backend to execute code with the custom Input to get the ouput
        let currDriverCode1: string;
        let currDriverCode2: string;
        if (selectedLanguage === 'C++') {
            currDriverCode1 = _Questions[currentQuestion].driverCode1['cpp'];
            currDriverCode2 = _Questions[currentQuestion].driverCode2['cpp'];
        }
        else if (selectedLanguage === 'C#') {
            currDriverCode1 = _Questions[currentQuestion].driverCode1['csharp'];
            currDriverCode2 = _Questions[currentQuestion].driverCode2['csharp'];
        }
        else if (selectedLanguage === 'Python') {
            currDriverCode1 = _Questions[currentQuestion].driverCode1['python'];
            currDriverCode2 = _Questions[currentQuestion].driverCode2['python'];
        }
        else {
            currDriverCode1 = _Questions[currentQuestion].driverCode1['java'];
            currDriverCode2 = _Questions[currentQuestion].driverCode2['java'];
        }
        axios
            .post('https://localhost:44322/api/Compiler2', {code: currDriverCode1 + code+ currDriverCode2, language: selectedLanguage, testCase: customTestCase})
            .then((response) => {
                setResult(`Output: ${response.data}`); // Update with the response from the backend
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSendAllTestcases = () => {
        // Make API call to backend to execute code with the custom Input and expectedOutput
        if (_Questions.length === 0) {
            console.log('Questions data is not available.');
            return;
        }
        let currDriverCode1: string;
        let currDriverCode2: string;
        if (selectedLanguage === 'C++') {
            currDriverCode1 = _Questions[currentQuestion].driverCode1['cpp'];
            currDriverCode2 = _Questions[currentQuestion].driverCode2['cpp'];
        }
        else if (selectedLanguage === 'C#') {
            currDriverCode1 = _Questions[currentQuestion].driverCode1['csharp'];
            currDriverCode2 = _Questions[currentQuestion].driverCode2['csharp'];
        }
        else if (selectedLanguage === 'Python') {
            currDriverCode1 = _Questions[currentQuestion].driverCode1['python'];
            currDriverCode2 = _Questions[currentQuestion].driverCode2['python'];
        }
        else {
            currDriverCode1 = _Questions[currentQuestion].driverCode1['java'];
            currDriverCode2 = _Questions[currentQuestion].driverCode2['java'];
        }
        const currentQuestionData = _Questions[currentQuestion];
        const { testCases } = currentQuestionData;

        const testCaseInputs = testCases.map((testCase) => extractStrings(testCase.inputs));
        const testCaseExpectedOutputs = testCases.map((testCase) => extractStrings(testCase.expectedOutput)[0]);
        console.log(testCaseExpectedOutputs);

        axios
            .post('https://localhost:44322/api/Compiler', {
                code: currDriverCode1 + code + currDriverCode2,
                language: selectedLanguage,
                QuestionNumber: currentQuestion + 1,
                testCaseInputs: testCaseInputs,
                expectedOutputs: testCaseExpectedOutputs,
                participantId: participantId,
            })
            .then(() => {
                setResult('Success');//if the backend api has executed the code
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <div className="row">
            <div className="col-sm">
                <div className="app">
                    {/*using the Editor component and passing the parameters and getting the current values uisng the callback function*/ }
                    <Editor
                        code={code}
                        onChange={handleCodeChange}
                        onLanguageChange={handleLanguageChange}
                        selectedLanguage={selectedLanguage}
                        languageOptions={languageOptions}
                        driverCode={_Questions[currentQuestion]?.functionCode || {}}
                    />
                    <br />
                    {/*displaying the initial value of the custom Input and getting the user edited value if user changes the value*/ }
                    <div className="form-group" key="customTestCase">
                        <label htmlFor="customTestCase">Custom Input</label>
                        <div className="alert alert-info">
                            Please enter the custom input in the same manner as given in the example input, i.e., each input variable in a different line.
                        </div>
                        <textarea
                            className="form-control"
                            id="customTestCase"
                            value={customTestCaseEntered ? customTestCase.join('\n') : extractStrings(_Questions[currentQuestion]?.testCases[0].inputs).join('\n')}
                            onChange={(event) => {
                                const inputValues = event.target.value.split('\n');
                                setCustomTestCase(inputValues);
                                setCustomTestCaseEntered(true);
                            }}
                        />
                    </div>
                    {/*button to check the output of custom Input*/ }
                    <button onClick={handleSendFirstTestcase} className="send-button">
                        Run
                    </button>
                    {/*button to submit the code for evaluation*/ }
                    <button onClick={handleSendAllTestcases} className="send-button">
                        Submit
                    </button>
                    <Output result={result} />
                </div>
            </div>
            <div className="col-sm">
                {/*checking if questions array exist and if there are any questions in the array*/}
                {(_Questions && _Questions.length > 0) && (
                    <div className="question-section">
                        <div className="question-count"></div>
                        <div>
                            {/*Displaying the Question description*/}
                            <span><strong>Question {currentQuestion + 1}</strong></span>
                            <div className="question-text">{_Questions[currentQuestion]?.question}</div>
                            <br />
                            <span><strong>Example</strong></span>
                            <div className="question-text">{_Questions[currentQuestion]?.explanationExample}</div>
                            <br />
                            <span><strong>Input Parameters</strong></span>
                            <div className="question-text">{_Questions[currentQuestion]?.inputFormat}</div>
                            <br />
                            <span><strong>Ouput Parameters</strong></span>
                            <div className="question-text">{_Questions[currentQuestion]?.outputFormat}</div>
                            <br/>
                            <div className="card mb-3">
                                <div className="card-body p-2">
                                    {/*Displaying one input and corresponding output to the user*/}
                                    <h6 className="card-title">Input:</h6>
                                    {extractStrings(_Questions[currentQuestion].testCases[0].inputs).map((input, index) => (
                                        <p className="card-text mb-1" key={index}>{input}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="card mb-3">
                                <div className="card-body p-2">
                                    <h6 className="card-title">Output:</h6>
                                    <pre className="card-text m-0">{extractStrings(_Questions[currentQuestion].testCases[0].expectedOutput)[0]}</pre>
                                </div>
                            </div>
                            {/*button to move to the next question*/ }
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => handleNextQuestion()}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Questions;