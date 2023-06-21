import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-dracula';

interface EditorProps {
    code: string;
    onChange: (code: string) => void;
    onLanguageChange: (language: string) => void;
    selectedLanguage: string;
    languageOptions: Array<string>;
    driverCode: Record<string, string>;
}
const Editor: React.FC<EditorProps> = ({
    code,
    onChange,
    onLanguageChange,
    selectedLanguage,
    languageOptions,
    driverCode
}) => {
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
        }
    }, [selectedLanguage, driverCode]);

    const handleChange = (value: string) => {
        onChange(value);
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const language = event.target.value;
        onLanguageChange(language);
    };

    let mode = '';
    if (selectedLanguage === 'C++') {
        mode = 'c_cpp';
    } else if (selectedLanguage === 'Java') {
        mode = 'java';
    } else if (selectedLanguage === 'Python') {
        mode = 'python';
    }

    return (
        <div>
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
                    onChange={handleChange}
                    editorProps={{ $blockScrolling: true }}
                    width="100%"
                    height="400px"
                    ref={(ref) => {
                        editorRef.current = ref;
                    }}
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

interface OutputProps {
    result: string;
}

const Output: React.FC<OutputProps> = ({ result }) => {
    return (
        <div className="output">
            <pre>{result}</pre>
        </div>
    );
};
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

interface RouteParams {
    participantId: string;
}

const Questions: React.FC = () => {
    const { participantId } = useParams<RouteParams>();
    const [code, setCode] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [_Questions, setQuestions] = useState<Array<_Question>>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('C++');
    const [customTestCase, setCustomTestCase] = useState(_Questions[currentQuestion]?.testCases[0].inputs || []);
    const [customTestCaseEntered, setCustomTestCaseEntered] = useState(false);
    const languageOptions = ['C++', 'Java', 'Python'];

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
    };

    useEffect(() => {
        axios
            .get('https://localhost:44322/api/Editor')
            .then((response) => {
                setQuestions(response.data);
                // Set the custom test case to the first test case inputs of the current question
                setCustomTestCase(response.data[currentQuestion]?.testCases[0]?.inputs || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [currentQuestion]);
;

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < _Questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setCurrentQuestion(0);
        }
    };
    const handleSendFirstTestcase = () => {
        // Make API call to backend to execute code with the custom test case and expected output
        axios
            .post('https://localhost:44322/api/Compiler2', { code, language: selectedLanguage, testCase: customTestCase, inputFormat: _Questions[currentQuestion].inputFormat })
            .then((response) => {
                setResult(`Output: ${response.data}`); // Update with the response from the backend
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSendAllTestcases = () => {
        if (_Questions.length === 0) {
            console.log('Questions data is not available.');
            return;
        }

        const currentQuestionData = _Questions[currentQuestion];
        const { testCases } = currentQuestionData;

        const testCaseInputs = testCases.map((testCase) => testCase.inputs);
        const testCaseExpectedOutputs = testCases.map((testCase) => testCase.expectedOutput);

        axios
            .post('https://localhost:44322/api/Compiler', {
                code,
                language: selectedLanguage,
                QuestionNumber: currentQuestion + 1,
                testCases: testCaseInputs,
                expectedOutputs: testCaseExpectedOutputs,
                participantId: participantId,
                customTestCase: customTestCase,
            })
            .then(() => {
                setResult('Success');
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <div className="row">
            <div className="col-sm">
                <div className="app">
                    <Editor
                        code={code}
                        onChange={handleCodeChange}
                        onLanguageChange={handleLanguageChange}
                        selectedLanguage={selectedLanguage}
                        languageOptions={languageOptions}
                        driverCode={_Questions[currentQuestion]?.driverCode || {}}
                    />
                    <div className="form-group" key="customTestCase">
                        <label>Custom Input</label>
                        <textarea
                            className="form-control"
                            id="customTestCase"
                            value={customTestCaseEntered ? customTestCase.join('\n') : _Questions[currentQuestion]?.testCases[0].inputs.join('\n')}
                            onChange={(event) => {
                                const inputValues = event.target.value.split('\n');
                                setCustomTestCase(inputValues);
                                setCustomTestCaseEntered(true);
                            }}
                        />

                    </div>

                    <button onClick={handleSendFirstTestcase} className="send-button">
                        Run
                    </button>
                    <button onClick={handleSendAllTestcases} className="send-button">
                        Submit
                    </button>
                    <Output result={result} />
                </div>
            </div>
            <div className="col-sm">
                {(_Questions && _Questions.length > 0) && (
                    <div className='question-section'>
                        <div className='question-count'></div>
                        <div>
                            <span>question {currentQuestion + 1}</span>
                            <div className='question-text'>{_Questions[currentQuestion]?.question}</div>
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