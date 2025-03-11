import React, { useEffect } from 'react'; // Import useEffect from react
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Import default Prism theme
import 'prismjs/components/prism-cpp.min.js';
import 'prismjs/components/prism-java.min.js';
import 'prismjs/components/prism-python.min.js';
import 'prismjs/components/prism-javascript.min.js';

const SourceCode = ({ language, sourceCode, activeTab }) => { // Accept activeTab as a prop
    useEffect(() => {
        Prism.highlightAll(); // Triggers syntax highlighting for the active tab
    }, [activeTab]);

    return (
        <div className="source-code">
            <pre className={`language-${language}`}>
                <code>{sourceCode}</code>
            </pre>
        </div>
    );
};

export default SourceCode;
