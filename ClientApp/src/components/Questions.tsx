import React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

const Questions = () => {
    
    const editor = CodeMirror(document.getElementById('editor') as HTMLElement, {
        value: 'Type your code here...',
        mode: 'javascript',
        theme: 'material'
    });
    return (
        <textarea id='editor'
            placeholder="Text to test"/>
        )
    editor.setValue('New code here...');



};

export default Questions;