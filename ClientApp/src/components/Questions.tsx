import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";


interface EditorProps {
    code: string;
    onChange: (code: string) => void;
    onLanguageChange: (language: string) => void;
    selectedLanguage: string;
    languageOptions: Array<string>;
}

const Editor: React.FC<EditorProps> = ({ code, onChange, onLanguageChange, selectedLanguage, languageOptions }) => {
    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = () => {
        if (editorRef.current) {
            const newCode = editorRef.current.value;
            onChange(newCode);
        }
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const language = event.target.value;
        onLanguageChange(language);
    };

    return (
        <div>
            <select value={selectedLanguage} onChange={handleLanguageChange}>
                {languageOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <textarea
                ref={editorRef}
                value={code}
                onChange={handleChange}
                className="editor"
                style={{ height: '400px', width: '100%' }}
            />
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

type _Question = {
    _id: string;
    question: string;
    languages: Array<string>;
    testCases: Array<string>;
    expectedOutputs: Array<string>;
    
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
    const languageOptions = ['C++', 'Java', 'Python'];
    console.log(participantId);
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
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < _Questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setCurrentQuestion(0);
        }
    };
    const handleSendFirstTestcase = () => {
        // Make API call to backend to execute code with the first testcase and expected output
        axios
        axios
            .post('https://localhost:44322/api/Compiler2', { code, language:selectedLanguage, testCase: _Questions[currentQuestion].testCases[0] })
            .then((response) => {
                setResult(`Output: ${response.data.output}`); // Update with the response from backend
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSendAllTestcases = () => {
        // Make API call to backend to execute code with all testcases and expected outputs
        if (_Questions.length === 0) {
            console.log('Questions data is not available.');
            return;
        }

        axios.post('https://localhost:44322/api/Compiler', {
            code,
            language: selectedLanguage,
            testCases: _Questions[currentQuestion].testCases,
            expectedOutputs: _Questions[currentQuestion].expectedOutputs,
            participantId: participantId
        })
            .then((response) => {
                setResult(`Output: ${response.data.output}`); // Update with the response from backend
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
                    />
                    <button onClick={handleSendFirstTestcase} className="send-button">
                        Send First Testcase
                    </button>
                    <button onClick={handleSendAllTestcases} className="send-button">
                        Send All Testcases
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