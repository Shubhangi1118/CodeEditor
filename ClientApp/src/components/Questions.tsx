import React, { useState, useEffect,useRef } from 'react';
import axios from "axios";

interface EditorProps {
    code: string;
    onChange: (code: string) => void;
}
const Editor: React.FC<EditorProps> = ({ code, onChange }) => {
    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = () => {
        if (editorRef.current) {
            const newCode = editorRef.current.value;
            onChange(newCode);
        }
    };

    return (
        <textarea
            ref={editorRef}
            value={code}
            onChange={handleChange}
            className="editor"
        />
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
    expectedOutput1: string;
    expectedOutput2: string;
    expectedOutput3: string;
    languages: Array<string>;
    testCase1: string;
    testCase2: string;
    testCase3: string;
};

const Questions: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [_Questions, setQuestions] = useState<Array<_Question>>([]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };

    const handleRunClick = () => {
        // Make API call to backend to execute code
        console.log(code);
        axios
            .post('https://localhost:44322/api/Compiler', code ) // Update with your backend API endpoint for code execution
            .then((response) => {
                setResult(`Output: ${response.data}`); // Update with the response from backend
            })
            .catch((err) => {
                console.log(err);
            });
    };


    useEffect(() => {
        axios.get("https://localhost:44322/api/Editor")
            .then(response => {
                setQuestions(response.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < _Questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setCurrentQuestion(0);
        }
    };

  
   
        return (
            <div className="row">
                <div className="col-sm">
                    <div className="app">
                        <Editor code={code} onChange={handleCodeChange} />
                        <button onClick={handleRunClick} className="run-button">
                            Run
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


