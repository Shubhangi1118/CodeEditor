import React, { useEffect } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript'

const Questions = () => {

    useEffect(() => {
        const editor = CodeMirror.fromTextArea(document.getElementById('editor') as HTMLTextAreaElement, {
            value: 'Type your code here...',
            mode: 'javascript',
            theme: 'material'
        });
        editor.setValue('New code here...');
    }, []);
    return (
        <textarea id='editor'
            placeholder="Type your code here"/>
        )


};

export default Questions;