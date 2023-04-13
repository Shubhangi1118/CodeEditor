import React, { useEffect, useState } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror';
import 'codemirror/theme/dracula.css';
import axios from "axios";

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

const Questions = () => {
    let [_Questions, setQuestions] = useState<Array<_Question>>([]);

    useEffect(() => {
        axios.get("https://localhost:44322/api/Editor")
            .then(response => {
                setQuestions(response.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const editor = CodeMirror.fromTextArea(document.getElementById('editor') as HTMLTextAreaElement, {
            value: 'Type your code here...',
            theme: 'dracula'
        });
        editor.setValue('New code here...');
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
                <textarea id='editor'
                    placeholder="Type your code here" />
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
